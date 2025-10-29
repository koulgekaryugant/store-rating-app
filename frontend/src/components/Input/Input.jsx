import React from 'react';

const Input = ({ label, type="text", value, onChange }) => {
  return (
    <div className="flex flex-col mb-4">
      <label className="mb-1 font-semibold">{label}</label>
      <input 
        type={type} 
        value={value} 
        onChange={onChange} 
        className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
      />
    </div>
  );
};

export default Input;
