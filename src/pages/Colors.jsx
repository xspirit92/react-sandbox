import { Space, Divider, Form } from "antd";
import { Colorpicker } from "antd-colorpicker";
import React, { useEffect, useState } from "react";


const Colors = () => {
    const [rgb, setRgb] = useState()
    
    const colorChanged = (value) => {
        setRgb(value?.rgb)
    }

    // useEffect(() => {
    //     var net = new brain.NeuralNetwork();

    //     net.train([{input: { r: 0.03, g: 0.7, b: 0.5 }, output: { black: 1 }},
    //             {input: { r: 0.16, g: 0.09, b: 0.2 }, output: { white: 1 }},
    //             {input: { r: 0.5, g: 0.5, b: 1.0 }, output: { white: 1 }}]);

    //     var output = net.run({ r: 1, g: 0.4, b: 0 });
    //     console.log(output);
    // })

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
        </Space>
    )
}

export default Colors