import React from "react";

type ButtonProps = {
  label : string;
  color : string;
}

const Button : React.FC<ButtonProps> = ({label, color}) => {
  const colorClass = `bg-${color}-400`
  return (
    <div>
      <button className={`btn w-full ${colorClass}`}>{label}</button>
    </div>
  );
};

export default Button;
