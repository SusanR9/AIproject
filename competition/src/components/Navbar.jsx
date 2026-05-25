import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/complogo.jpg';
function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <img src={logo} alt="Competition Hub" className="logo-img" />
          <span>Competition Hub</span>
        </Link>
        <div className="nav-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/registration" className="nav-link">Register</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;