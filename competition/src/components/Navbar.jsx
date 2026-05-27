import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo-container">

        <img
          src="/logo.png"
          alt="Competition Hub Logo"
          className="logo-image"
        />

        <h2 className="logo-text">
          Competition Hub
        </h2>

      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/registration">Register</Link>
      </div>

    </nav>
  );
}

export default Navbar;