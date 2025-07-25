import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="logo">Home Page</h2>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/charts">Charts</Link>
      </div>
    </nav>
  );
}

export default Navbar;