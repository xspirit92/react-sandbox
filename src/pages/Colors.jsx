import { Space, Divider, Form, Typography } from "antd";
import { Colorpicker } from "antd-colorpicker";
import React, { useEffect, useState } from "react";
import { NeuralNetwork } from 'brain.js'
import * as data from '../color-test.json'

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
                valueNum: Math.round(resultNN[item] * 100 ) / 100,
                value: (resultNN[item] * 100).toFixed(2) + '%'
            })
        }
        sortable.sort(function(a, b) {
            return b.valueNum - a.valueNum
        });

        setArray(sortable)
    }

    const getRGB = (colorName) => {
        const color = Array.from(data).find((item) => item.output[colorName])?.input
        return `rgb(${color.r*255},${color.g*255},${color.b*255})`
    }

    useEffect(() => {
        const net = new NeuralNetwork()

        net.train(data)
        
        setNet(net)
    }, [])

    return (
        <Space direction="vertical">
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
            <Title level={5}>Результаты нейронной сети</Title>
                {array?.map((item) =>
                    <div key={item.color} style={{display: 'flex', alignItems: 'center'}}>
                        <div style={{
                            height: 20,
                            width: 50,
                            backgroundColor: getRGB(item.color),
                            margin: 10
                        }}></div>
                        {item.color} {item.value}
                    </div>
                )}
        </Space>
    )
}

export default Colors