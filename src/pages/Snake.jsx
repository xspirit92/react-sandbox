import { Space, Typography } from 'antd'
import { useStore } from 'effector-react';
import React, { useEffect } from 'react'
import { Stage, Layer, Rect } from 'react-konva'
import { $cellStore, $foodStore, $snakeStore, FIELD_SIZE, startGameFx, stopGame } from '../entities/Snake';
import SnakeRect from '../widgets/snake/SnakeRect';

const { Title } = Typography;

const Snake = () => {
    const cells = useStore($cellStore)

    
    useEffect(() => {
        startGameFx()
        return () => stopGame()
    }, [])


    return (
        <Space direction='vertical'>
            <Title level={4}>Змейка</Title>
            <Stage width={FIELD_SIZE} height={FIELD_SIZE}>
                <Layer>
                    <Rect
                        x={0}
                        y={0}
                        width={FIELD_SIZE}
                        height={FIELD_SIZE}
                        strokeWidth={2}
                        stroke={'black'}
                    />
                    <SnakeRect cells={cells} />
                </Layer>
            </Stage>
        </Space>
    )
}

export default Snake