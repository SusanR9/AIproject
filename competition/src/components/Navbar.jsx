import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">

      <div className="navbar-left">

        <img
          src="/logo.png"
          alt="Competition Hub"
          className="navbar-logo"
        />

        <h1 className="navbar-title">
          Competition Hub
        </h1>

      </div>

      <nav className="navbar-right">
        <Link to="/">Home</Link>
        <Link to="/registration">Register</Link>
      </nav>

    </header>
  );
}

export default Navbar;