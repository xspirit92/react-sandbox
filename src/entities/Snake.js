import { createEffect, createEvent, createStore, forward, sample } from "effector"

export const FIELD_SIZE = 600
export const CELL_SIZE = 20
const TICK = 200

const CellTypeEnum = {
    Snake: 'green',
    Head: 'lime',
    Food: 'red'
}

const DirectionEnum = {
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

const tick = createEvent()
export const stopGame = createEvent()
const keyPressed = createEvent()


const $timerStore = createStore(null)
    .on(
        stopGame,
        timerId => {
            clearInterval(timerId)
            window.removeEventListener("keydown", keyPressed);
        }
    )
const $snakeStore = createStore(null)
    .reset(stopGame)
export const $cellStore = $snakeStore.map(snake => {
    let cells = []
    if (snake) {
        cells = snake.cells
        cells = [...cells, snake.food]
    }
    return cells
})


export const startGameFx = createEffect(() => {
    window.addEventListener("keydown", keyPressed)
    const timerId = setInterval(() => {
        tick()
    }, TICK)

    return timerId
})
const keyPressedFx = createEffect(({ snake, key }) => {
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
const snakeTickFx = createEffect(snake => {
    if (!snake) {
        defaultSnake.food = generate(defaultSnake.cells)
        return JSON.parse(JSON.stringify(defaultSnake))
    }
    const direction = snake.directionBuffer.length
        ? snake.directionBuffer[0]
        : snake.direction

    let head = snake.cells[0]
    if ((direction === DirectionEnum.Down && snake.food.x === head.x && snake.food.y === head.y + 1)
        || (direction === DirectionEnum.Up && snake.food.x === head.x && snake.food.y === head.y - 1)
        || (direction === DirectionEnum.Left && snake.food.x === head.x - 1 && snake.food.y === head.y)
        || (direction === DirectionEnum.Right && snake.food.x === head.x + 1 && snake.food.y === head.y)) {
        head.type = CellTypeEnum.Snake
        snake.food.type = CellTypeEnum.Head
        snake.cells.unshift(snake.food)
        snake.food = generate(snake.cells)

    } else {

        for (let i = snake.cells.length - 1; i >= 0; i--) {
            let cell = snake.cells[i]
            if (i === 0) {
                switch (direction) {
                    case DirectionEnum.Left:
                        cell.x--
                        break;
                    case DirectionEnum.Right:
                        cell.x++
                        break;
                    case DirectionEnum.Up:
                        cell.y--
                        break;
                    default:
                        cell.y++
                        break;
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

sample({
    clock: keyPressed,
    source: $snakeStore,
    fn: (snake, key) => ({ snake, key }),
    target: keyPressedFx,
})
sample({
    clock: startGameFx.doneData,
    fn: (_, timerId) => timerId,
    target: $timerStore
})
sample({
    clock: tick,
    source: $snakeStore,
    target: snakeTickFx
})
forward({
    from: snakeTickFx.doneData,
    to: $snakeStore
})

const randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const generate = cells => {
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