import { createEffect, createEvent, createStore, guard, sample } from "effector";

const STICKS_COUNT = 15

export const $sticksStore = createStore([])
export const $liveSticksCountStore = $sticksStore.map(sticks => sticks.filter(item => !item.isKilled).length)
export const $isUserMoveStore = createStore(true)

export const killSticks = createEvent()
export const unmountGame = createEvent()
export const gameMoveChanged = createEvent()
export const botShouldMove = createEvent()
export const gameFinished = createEvent()

export const initSticks = createEffect(() => {
    const array = []
    for (let i = 0; i < STICKS_COUNT; i++) {
        array.push({
            isKilled: false,
            key: Math.random()
        });
    }
    return array
})

$sticksStore
    .on(initSticks.doneData,
        (_, result) => result)
    .on(killSticks,
        (sticks, count) => {
            const isKilledCount = sticks.filter(item => item.isKilled).length
            const array = []
            for(let i = 0; i < sticks.length; i++) {
                let item = sticks[i]
                item.isKilled = STICKS_COUNT - isKilledCount - count <= i
                array.push(item)
            }
            return array
        })
    .reset(unmountGame)
    .reset(gameFinished)

$isUserMoveStore
    .on(gameMoveChanged,
        (isUserMove) => !isUserMove)
    .reset(unmountGame)
    .reset(gameFinished)

$liveSticksCountStore
    .on(
        botShouldMove,
        liveSticksCount => {
            setTimeout(() => {
                if (liveSticksCount === 0) return

                let count = Math.floor(Math.random() * 3) + 1
                if ( liveSticksCount > 5 && liveSticksCount <= 8) {
                    const mod = (liveSticksCount - 5) % 5
                    count = mod !== 0 ? mod : 3
                }
                else if (liveSticksCount === 5) count = 1
                else if (liveSticksCount === 4) count = 3
                else if (liveSticksCount === 3) count = 2
                else count = 1
    
                killSticks(count)
            }, 1000);
        }
    )
    .reset(unmountGame)
    .reset(gameFinished)

sample({
    clock: killSticks,
    source: $isUserMoveStore,
    target: gameMoveChanged,
})
guard({
    clock: gameMoveChanged,
    filter: (_, isUserMove) => isUserMove,
    source: $liveSticksCountStore,
    target: botShouldMove,
})
guard({
    clock: $liveSticksCountStore,
    filter: (_, liveSticksCount) => {
        return liveSticksCount === 0
    },
    source: gameMoveChanged,
    target: gameFinished,
})