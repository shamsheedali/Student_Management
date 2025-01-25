import React, { forwardRef } from 'react';

type InputProps = {
  label: string;
  error: string;
  type: string;
};

// Forward ref to the input element
const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, type }, ref) => {
  return (
    <label className="form-control w-full max-w-[26rem]">
      <div className="label">
        <span className="label-text">{label}</span>
      </div>
      <input
        ref={ref}
        type={type}
        placeholder="Type here"
        className="input input-bordered w-full max-w-[26rem]"
      />
      <div className="label">
        <span className="label-text-alt text-red-500">{error}</span>
      </div>
    </label>
  );
});

export default Input;
