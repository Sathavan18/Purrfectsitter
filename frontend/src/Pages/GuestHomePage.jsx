import logo from './purrfectsitter.PNG';
import "../Styles/GuestHomePage.css";
import { useNavigate } from "react-router-dom";
import { FaBookOpen, FaDog } from 'react-icons/fa'; // FontAwesome icons
import { MdPets } from 'react-icons/md';               // Material Design icons
import { IoMdSearch } from "react-icons/io";
import { BiSupport } from "react-icons/bi";
import { SiTicktick } from "react-icons/si";

const GuestHomePage = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    window.location.reload();
  };

  return (
    <div className="container">
      <nav className="navbar">
        <div className="nav-left">
          <button className="logo-button" onClick={handleLogoClick}>
            <img alt="logo" className="logo" src={logo} />
          </button>
        </div>

        <div className="nav-search" onClick={() => navigate("/search")}>
          <span className="search-text"><IoMdSearch /> Search Users</span>
        </div>

        <div className="nav-links">
          <button onClick={() => navigate("/about")}>About</button>
          <button onClick={() => navigate("/help")}>Help</button>
          <button onClick={() => navigate("/signup")}>Sign Up</button>
          <button onClick={() => navigate("/login")}>Sign In</button>
        </div>
      </nav>
      <div className="hero-section">
        <div className="hero-overlay">
            <h1>Welcome To PurrfectSitter</h1>
            <p>Your trusted place for finding loving pet sitters</p>
        </div>
      </div>

        <div className="info-section">
            <div className="info-box">
                <h2>What We Offer</h2>
                <ul>
                    <li>Find the perfect sitter for your pet <SiTicktick /></li>
                    <li>Book with ease <FaBookOpen /></li>
                    <li>Enjoy your time away knowing your pet is in good hands <FaDog/></li>
                    <li>24/7 customer support <BiSupport /></li>
                </ul>
            </div>
            <div className="info-box">
                <h2>How It Works</h2>
                <ul>
                    <li>Sign up for free <MdPets /></li>
                    <li>Search for sitters or become one yourself!</li>
                    <li>Follow the booking process</li>
                    <li>Enjoy your time away or earn some money</li>
                </ul>
            </div>
        </div>

    </div>
  );
};

export default GuestHomePage;