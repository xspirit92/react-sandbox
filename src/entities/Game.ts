import { createEffect, createEvent, createStore, forward, sample } from "effector";
import { Stick } from "./models/Game";

const STICKS_COUNT = 15

export const killSticks = createEvent<number>()
export const unmountGame = createEvent()
export const gameMoveChanged = createEvent<boolean>()
export const botShouldMove = createEvent()
export const gameFinished = createEvent()

export const $sticksStore = createStore<Stick[]>([])
    .reset(unmountGame)
    .reset(gameFinished)
export const $liveSticksCountStore = $sticksStore.map(sticks => sticks.filter((item: Stick) => !item.isKilled).length)
export const $isUserMoveStore = createStore<boolean>(true)
    .reset(unmountGame)
    .reset(gameFinished)

export const initSticksFx = createEffect(() => {
    const array = []
    for (let i = 0; i < STICKS_COUNT; i++) {
        array.push(new Stick(Math.random(), false));
    }
    return array
})
const botShouldMoveFx = createEffect((liveSticksCount: number) => {
    setTimeout(() => {
        if (liveSticksCount === 0) return

        let count = Math.floor(Math.random() * 3) + 1
        if (liveSticksCount > 5 && liveSticksCount <= 8) {
            const mod = (liveSticksCount - 5) % 5
            count = mod !== 0 ? mod : 3
        }
        if (liveSticksCount <= 5) {
            switch (liveSticksCount) {
                case 5:
                    count = 1
                    break;
                case 4:
                    count = 3
                    break;
                case 3:
                    count = 2
                    break;
                default:
                    count = 1
                    break;
            }
        }

        killSticks(count)
    }, 1000);
})
const killSticksFx = createEffect((params: ({sticks: Stick[], count: number})) => {
    const { sticks, count } = params
    const isKilledCount = sticks.filter((item: Stick) => item.isKilled).length
    const array = []
    for (let i = 0; i < sticks.length; i++) {
        let item = sticks[i]
        item.isKilled = STICKS_COUNT - isKilledCount - count <= i
        array.push(item)
    }
    return array
})
sample({
    clock: killSticks,
    source: $sticksStore,
    fn: (sticks, count) => ({ sticks, count }),
    target: killSticksFx,
})
forward({
    from: killSticksFx.doneData,
    to: $sticksStore
})
sample({
    clock: gameMoveChanged,
    fn: isUserMove => !isUserMove,
    target: $isUserMoveStore
})
sample({
    clock: killSticksFx.doneData,
    source: $isUserMoveStore,
    target: gameMoveChanged,
})
sample({
    clock: gameMoveChanged,
    filter: (isUserMove: boolean) => isUserMove,
    target: botShouldMove,
})
sample({
    clock: botShouldMove,
    source: $liveSticksCountStore,
    fn: (liveSticksCount, _) => liveSticksCount,
    target: botShouldMoveFx
})
sample({
    clock: $liveSticksCountStore,
    filter: (_, liveSticksCount) => {
        return liveSticksCount === 0
    },
    source: gameMoveChanged,
    target: gameFinished,
})
forward({
    from: initSticksFx.doneData,
    to: $sticksStore
})