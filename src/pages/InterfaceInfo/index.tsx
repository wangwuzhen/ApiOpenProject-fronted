import { PageContainer } from '@ant-design/pro-components';

import React, {useEffect, useState} from 'react';
import {
    getInterfaceInfoByIdUsingGet, invokeInterfaceInfoUsingPost,
    listInterfaceInfoByPageUsingGet
} from "@/services/ice-backend/interfaceInfoController";
import {Button, Card, Descriptions, Divider, Form, List, message} from "antd";
import {useMatch, useParams} from "react-router";
import TextArea from "antd/lib/input/TextArea";



const Index: React.FC = () => {
    //加载状态
    const [loading, setLoading] = useState(false);
    //列表数据
    const [data,setData] = useState<API.InterfaceInfo[]>([]);
    //总数
    // const match=useMatch('/interface_info/:id');
    //存储结果变量
    const[invokeRes,setInvokeRes]=useState<any>()
    //调用加载状态变量，默认为false
    const [invokeLoading, setInvokeLoading] = useState(false);


    const params  = useParams();


    //定义异步加载的函数
    const loadData=async ()=> {
        //检查动态路由是否存在
        if (!params.id){
            message.error('参数不存在');
            return;

        }

        //开始加载数据，设置loading状态为true
        setLoading(true);


        try {
            //调用接口获取数据
            const res = await getInterfaceInfoByIdUsingGet({
              id:Number(params.id),
            });

    setData(res.data);
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

    const onFinish= async (values : any) => {
        //判断是否存在接口id
        if (!params.id){
            message.error("接口不存在");
            return;
        }
        //在开始调用接口之前，将invokeLoading设置为true，表示正在加载中
        setInvokeLoading(true);
        try {
        const res=await invokeInterfaceInfoUsingPost({
                id: params.id,
                ...values,
            });
        //将接口调用的结果（res.data）更新到invokeRes状态变量中
            setInvokeRes(res.data);
            message.success("请求成功");
        } catch (error:any) {
            message.error('操作失败，'+error.message);
        }
     //无论成功或者失败 最后将加载状态设置为false
        setInvokeLoading(false);
    };

    return (
        <PageContainer title="在线接口开发平台">
           <Card>
               {data?(

               <Descriptions title={data.name} column={1}>
                   <Descriptions.Item label="接口状态">{data.status?'开启':'关闭'}</Descriptions.Item>
                   <Descriptions.Item label="描述">{data.description}</Descriptions.Item>
                   <Descriptions.Item label="请求地址">{data.url}</Descriptions.Item>
                   <Descriptions.Item label="请求方法">{data.method}</Descriptions.Item>
                   <Descriptions.Item label="请求参数">{data.requestParams}</Descriptions.Item>
                   <Descriptions.Item label="请求头">
                       {data.requestHeader}
                   </Descriptions.Item>
                   <Descriptions.Item label="响应头">{data.responseHeader}</Descriptions.Item>
                   <Descriptions.Item label="创建时间">{data.createTime}</Descriptions.Item>
                   <Descriptions.Item label="更新时间">{data.updateTime}</Descriptions.Item>
               </Descriptions>):(<>接口不存在</>)}
           </Card>
            <Divider/>
            <Card>
                <Form
                    name="invoke"
                    layout="vertical"
                    onFinish={onFinish}

                >
                    <Form.Item
                        label="请求参数"
                        name="requestParams"

                    >
                        <TextArea />
                    </Form.Item>


                    <Form.Item wrapperCol={{ span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            调用
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
            <Divider/>
            <Card title="返回结果" loading={invokeLoading}>
                {invokeRes}
            </Card>
        </PageContainer>
    );
};

export default Index;
