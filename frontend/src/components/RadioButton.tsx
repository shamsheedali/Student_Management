import React, { forwardRef } from "react";

type RadioButtonProps = {
  label: string;
  value: string;
};

const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  ({ label, value }, ref) => (
    <div className="form-control">
      <label className="label cursor-pointer">
        <span className="label-text text-white">{label}</span>
        <input
          ref={ref}
          type="radio"
          name="gender"
          value={value}
          className="radio checked:bg-blue-500"
        />
      </label>
    </div>
  )
);

export default RadioButton;
