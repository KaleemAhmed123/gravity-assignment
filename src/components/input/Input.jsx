import React from "react";
import "./Input.scss";
const Input = ({ label, icon }) => {
  return (
    <div className="input-container">
      <span className="label">{label}</span>
      <div className="input-box">
        <img src={icon} alt="icon logo" />
        <input type="text" name={label} id={label} />
      </div>
    </div>
  );
};

export default Input;
