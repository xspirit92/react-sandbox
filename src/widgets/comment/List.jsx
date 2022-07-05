import { Space, Spin } from 'antd'
import React from 'react'
import { deleteComment } from '../../entities/Comment'
import Comment from './Comment'

const List = (props) => {

  const removeComment = (id) => {
    deleteComment(id)
  }

  return (
    <>      
        {
          props.isLoading
            ? <div className='list'>
                <Space size="large">
                  <Spin size="large" />
                </Space>
              </div>
            : <div>
                <h2>{props.comments?.length ? "Comment List" : "Comments not found"}</h2>
                {props.comments?.map((comment) => (
                  <Comment
                    key={comment.id}
                    id={comment.id}
                    text={comment.body}
                    user={comment.email}
                    remove={removeComment}
                  />
                ))}
              </div>
        }
        
    </>
  )
}

export default List