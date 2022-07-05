import React from 'react'

const Input = props => {

  return (
    <div>      
      <input className="form-input" type="text" {...props}/>
    </div>
  )
}

export default Input