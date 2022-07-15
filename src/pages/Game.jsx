import { Button, Space, Divider, Typography } from "antd";
import { createEffect, sample } from "effector";
import { useStore } from "effector-react";
import React, { useEffect, useState } from "react";
import { $isUserMoveStore, $liveSticksCountStore, $sticksStore, gameFinished, initSticksFx, killSticks, unmountGame } from "../entities/Game";
import GameModal from "../widgets/game/GameModal";

const { Title } = Typography;

const Game = () => {
    const moves = [1, 2, 3]

    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isUserWin, setIsUserWin] = useState()
    const sticks = useStore($sticksStore)
    const liveSticksCount = useStore($liveSticksCountStore)
    const isUserMove = useStore($isUserMoveStore)

    const gameFinishedFx = createEffect(isUserMove => {
        setIsUserWin(!isUserMove)
        setIsModalVisible(true)
    })
    sample({
        clock: gameFinished,
        source: $liveSticksCountStore,
        fn: (_, isUserMove) => isUserMove,
        target: gameFinishedFx
    })

    useEffect(() => {
        initSticksFx()
        return () => unmountGame()
    }, [])

    return (
        <Space direction="vertical">
            <Title level={4}>Оставь последний ход боту и выйграй</Title>
            <Divider></Divider>
            <Space>
                {
                    sticks?.map((item) =>
                        <div key={item.key} style={{
                            height: 80,
                            width: 10,
                            backgroundColor: item.isKilled ? 'white' : 'black',
                            marginRight: 30,
                        }}></div>)
                }
            </Space>
            <Divider></Divider>
            {!isUserMove
                ? <Title level={5} >Ходит бот</Title>
                : <Title level={5}>Вы ходите. Сколько убрать?</Title>
            }
            <Space>
                {moves.map(item =>
                    <Button key={item} onClick={() => killSticks(item)} disabled={!isUserMove || liveSticksCount < item}>{item}</Button>
                )}
            </Space>
            <GameModal
                isModalVisible={isModalVisible}
                isUserWin={isUserWin}
                okHandler={() => {
                    setIsModalVisible(false)
                    initSticksFx()
                }} />
        </Space>
    )
}

export default Game