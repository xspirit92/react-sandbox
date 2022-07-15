import { createEffect, createEvent, createStore } from "effector"

export const FIELD_SIZE = 600
export const CELL_SIZE = 20
export const TICK = 200

export const CellTypeEnum = {
    Snake: 'green',
    Head: 'lime',
    Food: 'red'
}

export const DirectionEnum = {
    Left: 37,
    Up: 38,
    Right: 39,
    Down: 40,
}

const defaultSnake = {
    cells: [
        {
            key: 1,
            x: 2,
            y: 0,
            type: CellTypeEnum.Head
        },
        {
            key: 2,
            x: 1,
            y: 0,
            type: CellTypeEnum.Snake
        },
        {
            key: 3,
            x: 0,
            y: 0,
            type: CellTypeEnum.Snake
        }
    ],
    direction: DirectionEnum.Right,
    directionBuffer: []
}

export const tick = createEvent()
export const stopGame = createEvent()
export const keyPressed = createEvent()
export const startGameFx = createEffect(() => {
    window.addEventListener("keydown", keyPressed)
    const timerId = setInterval(() => {
        tick()
    }, TICK)

    return timerId
})
export const $timerStore = createStore(null)
    .on(
        startGameFx.doneData,
        (_, timerId) => {
            return timerId
        }
    )
    .on(
        stopGame,
        timerId => {
            clearInterval(timerId)
            window.removeEventListener("keydown", keyPressed);
        }
    )
export const $snakeStore = createStore(null)
    .on(
        tick,
        snake => {
            if (!snake) {
                defaultSnake.food = generate(defaultSnake.cells)
                return JSON.parse(JSON.stringify(defaultSnake))
            }
            const direction = snake.directionBuffer.length
                ? snake.directionBuffer[0]
                : snake.direction


            let cell = snake.cells[0]
            if (direction === DirectionEnum.Down && snake.food.x === cell.x && snake.food.y === cell.y + 1
                || direction === DirectionEnum.Up && snake.food.x === cell.x && snake.food.y === cell.y - 1
                || direction === DirectionEnum.Left && snake.food.x === cell.x - 1 && snake.food.y === cell.y
                || direction === DirectionEnum.Right && snake.food.x === cell.x + 1 && snake.food.y === cell.y) {
                cell.type = CellTypeEnum.Snake
                snake.food.type = CellTypeEnum.Head
                snake.cells.unshift(snake.food)
                snake.food = generate(snake.cells)

            } else {

                for (let i = snake.cells.length - 1; i >= 0; i--) {
                    cell = snake.cells[i]
                    if (i === 0) {
                        if (direction === DirectionEnum.Left) {
                            cell.x--
                        } else if (direction === DirectionEnum.Right) {
                            cell.x++
                        } else if (direction === DirectionEnum.Up) {
                            cell.y--
                        } else {
                            cell.y++
                        }
                        const tmpCell = snake.cells.find(item => item.y === cell.y && item.x === cell.x && item.key !== cell.key)
                        if (cell.y < 0 || cell.y > FIELD_SIZE / CELL_SIZE - 1
                            || cell.x < 0 || cell.x > FIELD_SIZE / CELL_SIZE - 1 || tmpCell) {
                            stopGame()
                            startGameFx()
                            return
                        }
                    } else {
                        cell.x = snake.cells[i - 1].x
                        cell.y = snake.cells[i - 1].y
                    }
                }
            }

            snake.directionBuffer.shift()
            snake.direction = direction
            return JSON.parse(JSON.stringify(snake))
        })
    .on(
        keyPressed,
        (snake, key) => {
            if (!snake) return
            if (snake.directionBuffer.length > 2) return
            if ([DirectionEnum.Up, DirectionEnum.Down, DirectionEnum.Left, DirectionEnum.Right].indexOf(key.keyCode) < 0) return
            const direction = snake.directionBuffer.length
                ? snake.directionBuffer[0]
                : snake.direction
            if (direction === key.keyCode) return
            if (Math.abs(direction - key.keyCode) === 2) return

            snake.directionBuffer.push(key.keyCode)
            return JSON.parse(JSON.stringify(snake))
        })
    .reset(stopGame)

export const $cellStore = $snakeStore.map(snake => {
    let cells = []
    if (snake) {
        cells = snake.cells
        cells = [...cells, snake.food]
    }
    return cells
})

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function generate(cells) {
    let x = 0
    let y = 0
    let ready = false

    while (!ready) {
        x = randomIntFromInterval(0, FIELD_SIZE / CELL_SIZE - 1)
        y = randomIntFromInterval(0, FIELD_SIZE / CELL_SIZE - 1)

        ready = !cells?.find(item => item.x === x && item.y === y)
    }
    return {
        key: Date.now(),
        x: x,
        y: y,
        type: CellTypeEnum.Food
    }
}