import React from "react"
import { Modal } from "antd";

const GameModal = (props: { isModalVisible: boolean, isUserWin: boolean, okHandler: (e: any) => void }) => {

    return (        
        <Modal
            title="Игра окончена" 
            visible={props.isModalVisible}
            cancelButtonProps={{ style: { display: 'none' } }}
            onOk={props.okHandler}>
            {props.isUserWin
                ? <p>Вы выиграли!</p>
                : <p>Вы проиграли!</p>
            }
        </Modal>
    )
}

export default GameModal