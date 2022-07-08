import React, { useEffect, useState } from 'react'
import { Column } from '@ant-design/plots'

const ColorsChart = (props) => {
    const config = {
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
        color: item => item.color,
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