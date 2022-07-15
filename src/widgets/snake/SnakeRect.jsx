import React from 'react'
import { Rect } from 'react-konva'
import { CELL_SIZE } from '../../entities/Snake'

const SnakeRect = (props) => {

    return (
        props.cells.reverse().map(item =>
            <Rect
                key={item.key}
                x={CELL_SIZE * item.x}
                y={CELL_SIZE * item.y}
                width={CELL_SIZE}
                height={CELL_SIZE}
                fill={item.type}
            />
        )
    )    
}

export default SnakeRect