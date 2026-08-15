import logo from "../../assets/images/srishti-logo.png";

export default function Navbar() {
  return (
    <nav className="navbar">
      <a href="#" className="navbar-logo">
        <img src={logo} alt="Srishti 2.7" />
        <span className="navbar-brand-name">
          SRISHTI <span>2.7</span>
        </span>
      </a>

      <div className="navbar-links">
        <a href="#about">ABOUT</a>
        <a href="#events">EVENTS</a>
        <a href="#showcase">SHOWCASE</a>
      </div>

      <button className="menu-button" aria-label="Toggle Menu">
        <span>MENU</span>
        <div className="menu-icon">
          <i />
          <i />
          <i />
        </div>
      </button>
    </nav>
  );
}