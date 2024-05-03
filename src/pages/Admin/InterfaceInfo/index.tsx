import {
    addInterfaceInfoUsingPost,
    deleteInterfaceInfoUsingPost,
    listInterfaceInfoByPageUsingGet,
    offlineInterfaceInfoUsingPost,
    onlineInterfaceInfoUsingPost,
    updateInterfaceInfoUsingPost
} from '@/services/ice-backend/interfaceInfoController';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Drawer, message } from 'antd';
import { SortOrder } from 'antd/lib/table/interface';
import React, { useRef, useState } from 'react';
import UpdateModal from './components/UpdateModal';
import CreateModal from "./components/CreateModal";




const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.InterfaceInfo>();
  const [selectedRowsState, setSelectedRows] = useState<API.InterfaceInfo[]>([]);

/**
* @en-US Add node
  * @zh-CN 添加节点
  * @param fields
  */
//新建
  const handleAdd = async (fields: API.InterfaceInfo) => {
    const hide = message.loading('正在添加');
    try {
      await addInterfaceInfoUsingPost({
        ...fields,
      });
      hide();
      message.success('创建成功');
      handleModalOpen(false);
      return true;
    } catch (error:any) {
      hide();
      message.error('创建失败'+error.message);
      return false;
    }
  };

  /**
   * @en-US Update node
   * @zh-CN 更新节点
   *
   * @param fields
   */
  const handleUpdate = async (fields: API.InterfaceInfo) => {
    if (!currentRow){
    return ;
    }
    const hide = message.loading('修改中');
    try {
      await updateInterfaceInfoUsingPost({
        id:currentRow?.id,
       ...fields
      });
      hide();
      message.success('操作成功');
      return true;
    } catch (error:any) {
      hide();
      message.error('操作失败'+error.message);
      return false;
    }
  };

  /**
   *  Delete node
   * @zh-CN 发布节点
   *
   */
  const handleOnline = async (recode: API.IdRequest) => {
    const hide = message.loading('正在发布');
    if (!recode) return true;
    try {
      await onlineInterfaceInfoUsingPost({
        id: recode.id
      });
      hide();
      message.success('发布成功');
      actionRef.current?.reload();
      return true;
    } catch (error:any) {
      hide();
      message.error('发布失败'+error.message);
      return false;
    }
  };

    /**
     *  Delete node
     * @zh-CN 下线节点
     *
     */
    const handleOffline = async (recode: API.IdRequest) => {
        const hide = message.loading('正在下线');
        if (!recode) return true;
        try {
            await offlineInterfaceInfoUsingPost({
                id: recode.id
            });
            hide();
            message.success(' 下线成功');
            actionRef.current?.reload();
            return true;
        } catch (error:any) {
            hide();
            message.error('下线失败'+error.message);
            return false;
        }
    };
    /**
     *  Delete node
     * @zh-CN 删除节点
     *
     */
    const handleRemove = async (recode: API.InterfaceInfo) => {
        const hide = message.loading('正在删除');
        if (!recode) return true;
        try {
            await deleteInterfaceInfoUsingPost({
                id: recode.id
            });
            hide();
            message.success(' 删除成功');
            actionRef.current?.reload();
            return true;
        } catch (error:any) {
            hide();
            message.error('删除失败'+error.message);
            return false;
        }
    };
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  //展示列名
  //将 columns 类型设置为我们的接口类型
  const columns: ProColumns<API.InterfaceInfo>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'index',
    },

    {
      title: '接口名称',
      dataIndex: 'name',
      valueType: 'text',
      formItemProps: {
        rules: [{
          required: true,
        }],
      }
    },
    {
      title: '描述',
      dataIndex: 'description',
      valueType: 'textarea',
    },
    {
      title: '请求方法',
      dataIndex: 'method',
      valueType: 'text',
    },
    {
      title: 'url',
      dataIndex: 'url',
      valueType: 'text',
      formItemProps:{
        rules:[{
          required: true,
        }],

      }
    },
      {
        title: '请求参数',
        dataIndex: 'requestParams',
        valueType: 'jsonCode',

      },
    {
      title: '请求头',
      dataIndex: 'requestHeader',
      valueType: 'jsonCode',
    },
    {
      title: '响应头',
      dataIndex: 'responseHeader',
      valueType: 'jsonCode',
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '关闭',
          status: 'Default',
        },
        1: {
          text: '开启',
          status: 'Processing',
        },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInForm:true,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInForm:true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          修改
        </a>,
          record.status===0?
        <a
            key="online"
            onClick={() => {
              handleOnline(record);
            }}
        >
          发布
        </a>:null,
          record.status===1?
        <Button
            type="text"
            danger
          key="offline"
          onClick={() => {
            handleOffline(record);
          }}
        >
          下线
        </Button>:null,
          <Button
              type="text"
              danger
              key="config"
              onClick={() => {
                  handleRemove(record);
              }}
          >
              删除
          </Button>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.RuleListItem, API.PageParams>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        //向后端发送请求 list数据
        request={async (
          params: {
            pageSize?: number;
            current?: number;
            keyword?: string;
          },
          sort: Record<string, SortOrder>,
          filter: Record<string, (string | number)[] | null>,
        ) => {
          const res = await listInterfaceInfoByPageUsingGet({
            ...params,
          });
          if (res.data) {
            return {
              data: res?.data.records || [],
              success: true,
              total: res.data.total,
            };
          } else {
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项 &nbsp;&nbsp;
              <span>
                服务调用次数总计 {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)} 万
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
          <Button type="primary">批量审批</Button>
        </FooterToolbar>
      )}

      <UpdateModal columns={columns}
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        visible={updateModalOpen}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>
      <CreateModal columns={columns}
                   onCancel={()=>{handleModalOpen(false)}}
                   onSubmit={(values)=>{handleAdd(values)}}
                   visible={createModalOpen}/>
    </PageContainer>
  );
};
export default TableList;
