import { createEffect, createEvent, createStore } from "effector";

export const fetchCommentsFx = createEffect(async () => {
    const response =  await fetch("https://jsonplaceholder.typicode.com/comments?_start=0&_limit=25")
    return await response.json()
})

export const deleteComment = createEvent()
export const addComment = createEvent()
export const unmount = createEvent()

export const $commentStore = createStore([])

$commentStore
    .on(fetchCommentsFx.doneData,
        (_, result) => result)
    .on(deleteComment,
        (comments, id) => comments.filter(item => {
            return item.id !== id
        }))
    .on(addComment,
        (comments, comment) => [comment, ...comments])
    .reset(unmount)