import React, { useState } from "react";
import Input from '../../shared/Input'
import Button from '../../shared/Button'
import { addComment } from "../../entities/Comment";
import { Comment } from "../../entities/models/Comment";

const Form = () => {
    const [email, setEmail] = useState('')
    const [body, setBody] = useState('')

    const createComment = (e: any) => {
        e.preventDefault();

        const comment = new Comment(Date.now(), email, body)
        addComment(comment)
        setEmail('')
        setBody('')
    };

    return(
        <div>
            <form>
                <Input value={ email } onChange={ (e: any) => { setEmail(e.target.value) }} placeholder="Email" />
                <Input value={ body } onChange={ (e: any) => { setBody(e.target.value) }} placeholder="Текст" />
                <Button onClick={createComment}>Добавить</Button>
            </form>
        </div>
    )
}

export default Form