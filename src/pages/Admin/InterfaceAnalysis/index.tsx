import {PageContainer} from "@ant-design/pro-components";

import '@umijs/max';
import React, {useEffect, useState} from 'react';
import ReactECharts from 'echarts-for-react';
import {listTopInvokeInterfaceInfoUsingGet} from "@/services/ice-backend/analysisController";
const InterfaceAnalysis: React.FC = () => {

    // 存储数据的状态
    const [data, setData] = useState<API.InterfaceInfoVO[]>([]);
    // 控制加载状态的状态，默认加载中(true)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {


        listTopInvokeInterfaceInfoUsingGet().then(res => {
            if (res.data) {
                setData(res.data);
            }
        })
    } catch (e: any) {

    }
    },[])
    // 映射：{ value: 1048, name: 'Search Engine' },
    const chartData = data.map(item => {
        return {
            value: item.totalNum,
            name: item.name,
        }
    })
    const option = {
        title: {
            text: '调用次数最多的接口TOP3',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left'
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: '50%',
                data: chartData,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };


  return (
    <PageContainer>
        {/* 使用 ReactECharts 组件，传入图表配置 */}
        <ReactECharts loadingOption={{
            // 控制加载状态
            showLoading: loading
        }}
                      option={option} />
    </PageContainer>
  );
};
export default InterfaceAnalysis;
