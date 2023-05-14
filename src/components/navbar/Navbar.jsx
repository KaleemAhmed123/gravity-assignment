import React from "react";
import "./Navbar.scss";
import logo from "/logo.png";

const Navbar = () => {
  return (
    <nav>
      <div className="navbar">
        <img src={logo} alt="logo" />
      </div>
    </nav>
  );
};

export default Navbar;
