import React from "react";

const Button = (props) => {
  return (
    <div>
      <button {...props} className="form-button">{props.children}</button>
    </div>
  );
};

export default Button;
