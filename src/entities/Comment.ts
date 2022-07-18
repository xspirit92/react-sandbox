import { createEffect, createEvent, createStore, forward, sample } from "effector";
import { Comment } from "./models/Comment";

export const fetchCommentsFx = createEffect(async () => {
    const response =  await fetch("https://jsonplaceholder.typicode.com/comments?_start=0&_limit=25")
    const json = await response.json()
    return json as Comment[]
})

export const deleteComment = createEvent<number>()
export const addComment = createEvent<Comment>()
export const unmount = createEvent()

export const $commentStore = createStore<Comment[]>([])
    .reset(unmount)

export const deleteCommentFx = createEffect((params: {comments: Comment[], id: number}) => params.comments.filter((item: Comment) => {
    return item.id !== params.id
}))
export const addCommentFx = createEffect((params: {comments: Comment[], comment: Comment}) => {
    return [params.comment, ...params.comments]
})

forward({
    from: fetchCommentsFx.doneData,
    to: $commentStore
})
sample({
    clock: addComment,
    source: $commentStore,
    fn: (comments, comment) => ({comments, comment}),
    target: addCommentFx
})
forward({
    from: addCommentFx.doneData,
    to: $commentStore
})
sample({
    clock: deleteComment,
    source: $commentStore,
    fn: (comments, id) => ({comments, id}),
    target: deleteCommentFx
})
forward({
    from: deleteCommentFx.doneData,
    to: $commentStore
})