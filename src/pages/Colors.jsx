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
            r: value?.rgb.r,
            g: value?.rgb.g,
            b: value?.rgb.b
        }
        setRgb(color)
        
        const resultNN = net.run(color)

        let sortable = [];
        for (let item in resultNN) {
            sortable.push({
                color: item,
                value: (resultNN[item] * 100).toFixed(2) + '%'
            })
        }
        sortable.sort(function(a, b) {
            return a.value < b.value ? 1 : -1
        });

        setArray(sortable)
    }

    const getRGB = (colorName) => {
        const color = Array.from(data).find((item) => item.output[colorName])?.input
        return `rgb(${color.r},${color.g},${color.b})`
    }
    const getRGBValue = (colorName) => {
        const color = Array.from(data).find((item) => item.output[colorName])?.input
        return `[${color.r},${color.g},${color.b}]`
    }

    useEffect(() => {
        const net = new NeuralNetwork()
        const testData = data

        net.train(testData)
        
        setNet(net)
    }, [])

    return (
        <Space direction="vertical">
            <Space>
                <Form>
                    <Form.Item name={`color`}>
                        <Colorpicker
                            picker={'ChromePicker'} 
                            value={'red'}
                            onChange={(value) => colorChanged(value)} />
                    </Form.Item>
                </Form>
                <Space direction={'vertical'}>
                    <p>r = {rgb?.r}</p>
                    <p>g = {rgb?.g}</p>
                    <p>b = {rgb?.b}</p>
                </Space>
            </Space>
            <Divider></Divider>
            <Title level={5}> Результаты</Title>
            {array?.map((item) => (
                <div key={item.color} style={{display: 'flex', alignItems: 'center'}}>
                    <div style={{
                        height: 20,
                        width: 50,
                        backgroundColor: getRGB(item.color),
                        margin: 10
                    }}></div>
                    {item.color} {item.value}
                </div>
            ))}
        </Space>
    )
}

export default Colors