import React from "react";

const Button = (props: {children: any, onClick: (e:any) => void}) => {
  return (
    <div>
      <button {...props} className="form-button">{props.children}</button>
    </div>
  );
};

export default Button;
