import React from 'react'
import { Column } from '@ant-design/plots'

const ColorsChart = (props: {data: any}) => {
    const config: any = {
        data: props.data,
        xField: 'color',
        yField: 'valueNum',
        label: {
        position: 'top',
        style: {
            fill: '#00000',
            opacity: 0.9,
        },
        },
        xAxis: {
            label: {
                autoHide: true,
                autoRotate: false,
            },
        },
        backgroundColor: '#000',
        color: (item: any) => item.color,
        meta: {
            color: {
                alias: '类别',
            },
            valueNum: {
                alias: '销售额',
            },
        },
    }
  
    return <Column {...config} />;
};

export default ColorsChart