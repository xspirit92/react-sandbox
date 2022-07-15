import { Space, Divider, Form, Typography } from "antd";
import { Colorpicker } from "antd-colorpicker";
import React, { useEffect, useState } from "react";
import { NeuralNetwork } from 'brain.js'
import * as data from '../color-test.json'
import ColorsChart from "../widgets/colors/ColorsChart";

const { Title } = Typography;

const Colors = () => {
    const [rgb, setRgb] = useState()
    const [net, setNet] = useState()
    const [array, setArray] = useState([])
    
    const colorChanged = (value) => {
        const color = {
            r: value?.rgb.r/255,
            g: value?.rgb.g/255,
            b: value?.rgb.b/255
        }
        setRgb(color)
        
        const resultNN = net.run(color)

        let sortable = [];
        for (let item in resultNN) {
            sortable.push({
                color: item,
                valueNum: Math.round(resultNN[item] * 100 ) / 100
            })
        }
        sortable.sort(function(a, b) {
            return b.valueNum - a.valueNum
        });

        setArray(sortable)
    }
    useEffect(() => {
        const net = new NeuralNetwork()

        net.train(data)
        
        setNet(net)
    }, [])

    return (
        <Space direction="vertical" style={{width: '100%'}}>
        <Title level={4}>Выберите цвет</Title>
            <Space>
                <Form>
                    <Form.Item name={`color`}>
                        <Colorpicker
                            picker={'ChromePicker'} 
                            value={'red'}
                            onChange={(value) => colorChanged(value)} />
                    </Form.Item>
                </Form>
            </Space>
            <Divider></Divider>
            {array.length
                ? <Space style={{width: '100%'}} direction="vertical">
                    <Title level={5}>Результаты нейронной сети</Title>
                    <ColorsChart data={array}></ColorsChart>
                  </Space>
                : <></>}
        </Space>
    )
}

export default Colors