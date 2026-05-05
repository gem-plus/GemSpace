import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
function NavBar() {
  const navigate = useNavigate();
  function handleProfile() {
    navigate("/profile");
  }

  function handleHome() {
    navigate("/");
  }
  return (
    <>
      <ul className="navbar">
        <li className="navbar-item-left">
          <img className="logo" src={logo} alt="logo" />
        </li>
        <li className="navbar-item-right" onClick={handleHome}>
          Home
        </li>
        <a
          className="plain-text"
          href="https://github.com/gem-plus"
          target="_blank"
        >
          <li className="navbar-item-right">Contact Us</li>
        </a>
        <li className="navbar-item-right" onClick={handleProfile}>
          Profile
        </li>
      </ul>
    </>
  );
}

export default NavBar;
