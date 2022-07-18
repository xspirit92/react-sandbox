import { CELL_SIZE, FIELD_SIZE } from "../Snake";

export enum CellTypeEnum {
    Snake = 'green',
    Head = 'lime',
    Food = 'red'
}

export enum DirectionEnum {
    Left = 37,
    Up = 38,
    Right = 39,
    Down = 40,
}

export class Snake {
    cells: Array<Cell>;
    direction: DirectionEnum;
    directionBuffer: Array<DirectionEnum>;
    food: Cell;

    constructor(snake?: Snake) {
        if (!snake) {
            this.cells = [
                new Cell(1, 2, 0, CellTypeEnum.Head),
                new Cell(2, 1, 0, CellTypeEnum.Snake),
                new Cell(3, 0, 0, CellTypeEnum.Snake),
            ];
            this.direction = DirectionEnum.Right;
            this.directionBuffer = [];
            this.food = this.generateFood()
        } else {
            this.cells = snake.cells;
            this.direction = snake.direction;
            this.directionBuffer = snake.directionBuffer;
            this.food = snake.food
        }
    }

    generateFood() {
        let x = 0
        let y = 0
        let ready = false

        while (!ready) {
            x = this.randomIntFromInterval(0, FIELD_SIZE / CELL_SIZE - 1)
            y = this.randomIntFromInterval(0, FIELD_SIZE / CELL_SIZE - 1)

            ready = !this.cells?.find((item: Cell) => item.x === x && item.y === y)
        }
        return new Cell(Date.now(), x, y, CellTypeEnum.Food)
    }

    randomIntFromInterval(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
}

export class Cell {
    key: number;
    x: number;
    y: number;
    type: CellTypeEnum;

    constructor(key: number, x: number, y: number, type: CellTypeEnum) {
        this.key = key;
        this.x = x;
        this.y = y;
        this.type = type;
    }
}