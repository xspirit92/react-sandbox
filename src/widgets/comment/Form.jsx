import React, { useState } from "react";
import Input from '../../shared/Input'
import Button from '../../shared/Button'
import { addComment } from "../../entities/Comment";

const Form = () => {
    const [comment, setComment] = useState({})

    const createComment = (e) => {
        e.preventDefault();

        comment.id = Date.now()
        addComment(comment)

        setComment({ ...comment, email: '', body: '' })
    };

    return(
        <div>
            <form>
                <Input value={ comment.email } onChange={ e => { setComment({ ...comment, email: e.target.value }) }} placeholder="Email" />
                <Input value={ comment.body } onChange={ e => { setComment({ ...comment, body: e.target.value }) }} placeholder="Текст" />
                <Button onClick={createComment}>Добавить</Button>
            </form>
        </div>
    )
}

export default Form