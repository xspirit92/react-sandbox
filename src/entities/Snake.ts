import { createEffect, createEvent, createStore, forward, sample } from "effector"
import { Cell, CellTypeEnum, DirectionEnum, Snake } from "./models/Snake"

export const FIELD_SIZE = 600
export const CELL_SIZE = 20
const TICK = 100


const tick = createEvent()
export const stopGame = createEvent()
const keyPressed = createEvent<KeyboardEvent>()


const $timerStore = createStore<number>(0)
    .on(
        stopGame,
        (timerId: number) => {
            clearInterval(timerId)
            window.removeEventListener("keydown", keyPressed);
        }
    )
const $snakeStore = createStore<Snake | null>(null)
    .reset(stopGame)
export const $cellStore = $snakeStore.map((snake: Snake | null) => {
    let cells: Cell[] = []
    if (snake) {
        cells = snake.cells
        cells = [...cells, snake.food]
    }
    return cells
})


export const startGameFx = createEffect(() => {
    window.addEventListener("keydown", keyPressed)
    const timerId = window.setInterval(() => {
        tick()
    }, TICK)

    return timerId
})
const keyPressedFx = createEffect((param: ({snake: Snake | null, keyboardEvent: KeyboardEvent})) => {
    const { snake, keyboardEvent } = param
    if (!snake) return
    if (snake.directionBuffer.length > 2) return
    if ([DirectionEnum.Up, DirectionEnum.Down, DirectionEnum.Left, DirectionEnum.Right].indexOf(keyboardEvent.keyCode) < 0) return
    const direction = snake.directionBuffer.length
        ? snake.directionBuffer[0]
        : snake.direction
    if (direction === keyboardEvent.keyCode) return
    if (Math.abs(direction - keyboardEvent.keyCode) === 2) return

    snake.directionBuffer.push(keyboardEvent.keyCode)
    return new Snake(snake)
})
const snakeTickFx = createEffect((snake: Snake | null) : Snake | null => {
    if (!snake) {
        return new Snake()
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
        snake.food = snake.generateFood()

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
                const tmpCell = snake.cells.find((item: Cell) => item.y === cell.y && item.x === cell.x && item.key !== cell.key)
                if (cell.y < 0 || cell.y > FIELD_SIZE / CELL_SIZE - 1
                    || cell.x < 0 || cell.x > FIELD_SIZE / CELL_SIZE - 1 || tmpCell) {
                    stopGame()
                    startGameFx()
                    return null
                }
            } else {
                cell.x = snake.cells[i - 1].x
                cell.y = snake.cells[i - 1].y
            }
        }
    }

    snake.directionBuffer.shift()
    snake.direction = direction
    return new Snake(snake)
})

sample({
    clock: keyPressed,
    source: $snakeStore,
    fn: (snake: Snake | null, keyboardEvent: KeyboardEvent) => ({snake, keyboardEvent}),
    target: keyPressedFx,
})
sample({
    clock: startGameFx.doneData,
    fn: (timerId: number) => timerId,
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