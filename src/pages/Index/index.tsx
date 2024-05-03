import { PageContainer } from '@ant-design/pro-components';

import React, {useEffect, useState} from 'react';
import {listInterfaceInfoByPageUsingGet} from "@/services/ice-backend/interfaceInfoController";
import {List, message} from "antd";



const Index: React.FC = () => {
    //加载状态
    const [loading, setLoading] = useState(true);
    //列表数据
    const [list,setList] = useState<API.InterfaceInfo[]>([]);
    //总数
    const [total, setTotal] = useState<number>(0);
    //定义异步加载的函数
    const loadData=async (current=1,pageSize=5)=> {
        //开始加载数据，设置loading状态为true
        setLoading(true);


        try {
            //调用接口获取数据
            const res = await listInterfaceInfoByPageUsingGet({
                current,
                pageSize,
            });

            //将请求返回的数据设置到列表数据状态中
            setList(res?.data?.records ?? []);

            //将请求返回的总数设置到总数状态中
            setTotal(res?.data?.total ?? 0);
            //捕捉请求失败的错误信息
        } catch (error: any) {
            //请求失败时提示错误信息
            message.error('请求失败，' + error.message)
        }
        //数据加载成功或失败后，设置loading状态为false
        setLoading(false);
    };

    useEffect(()=>{
        loadData();
    },[]);
    //页面加载完成后调用加载数据的函数

  return (
    <PageContainer title="在线接口开发平台">
        <List
            className="my-list"
            loading={loading}
            itemLayout="horizontal"
            dataSource={list}
            renderItem={(item) => {

                //构建列表项的链接地址
                const apiLink=`/interface_info/${item.id}`;
                return(

                <List.Item actions={[ <a key="item.id" href={apiLink}>查看</a>]}>
                        <List.Item.Meta
                            // avatar={<Avatar src={item.picture.large} />}
                            title={<a href={apiLink}>{item.name}</a>}
                            description={item.description}
                        />

                </List.Item>
        );
            }
            }

            pagination={{

                showTotal(total:number) {
                return '总数：'+total;
                },
                pageSize : 5,
                total,
                onChange(page,pageSize) {
                loadData(page,pageSize);
                }
            }}
        />
    </PageContainer>
  );
};

export default Index;
