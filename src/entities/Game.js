import { createEffect, createEvent, createStore, forward, sample } from "effector";

const STICKS_COUNT = 15

export const killSticks = createEvent()
export const unmountGame = createEvent()
export const gameMoveChanged = createEvent()
export const botShouldMove = createEvent()
export const gameFinished = createEvent()

export const $sticksStore = createStore([])
    .reset(unmountGame)
    .reset(gameFinished)
export const $liveSticksCountStore = $sticksStore.map(sticks => sticks.filter(item => !item.isKilled).length)
export const $isUserMoveStore = createStore(true)
    .reset(unmountGame)
    .reset(gameFinished)

export const initSticksFx = createEffect(() => {
    const array = []
    for (let i = 0; i < STICKS_COUNT; i++) {
        array.push({
            isKilled: false,
            key: Math.random()
        });
    }
    return array
})
const botShouldMoveFx = createEffect(liveSticksCount => {
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
const killSticksFx = createEffect(({ sticks, count }) => {
    const isKilledCount = sticks.filter(item => item.isKilled).length
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
    filter: (_, isUserMove) => isUserMove,
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