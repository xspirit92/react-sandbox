import React from 'react';
import Button from '../../shared/Button';

// Functional component
const Comment = props => {

  const removeComment = (id) => {
    props.remove(id)
  }

  return (
    <div className="comment-container">
      <div style={{paddingBottom: '20px'}}>
        <p>"{props.text}"</p>
        <div className="details-container">
          <small>
            Sent by <b>{props.user}</b>
          </small>
        </div>
      </div>      
      <Button onClick={e => {removeComment(props.id)}}>Удалить</Button>
    </div>
  );
};

export default Comment