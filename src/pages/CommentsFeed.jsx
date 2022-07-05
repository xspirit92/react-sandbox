import React, { useEffect } from "react";
import List from "../widgets/comment/List";
import Form from "../widgets/comment/Form";
import { useStore } from "effector-react";
import { $commentStore, fetchCommentsFx, unmount } from "../entities/Comment";

const CommentsFeed = () => {
    const comments = useStore($commentStore)
    const isLoading = useStore(fetchCommentsFx.pending)

    useEffect(() => {
        fetchCommentsFx()
        return () => unmount()
    }, [])


    return (
        <div id="commentsfeed">
            <Form />
            <List comments={ comments } isLoading = { isLoading } />
        </div>
    )
}

export default CommentsFeed