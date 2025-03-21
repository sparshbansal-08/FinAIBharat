function Navbar() {
    return (
      <nav className="navbar">
        <div className="nav-left">
          <img src="/assets/logo.jpg" alt="Logo" className="nav-logo" />
        </div>
        <div className="nav-right">
          <button className="nav-btn">Sign In</button>
          <button className="nav-btn">Sign Up</button>
        </div>
      </nav>
    );
  }
  
  export default Navbar;