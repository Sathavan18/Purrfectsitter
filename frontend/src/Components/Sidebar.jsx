import { Link, useNavigate } from 'react-router-dom';
import { RiHome2Fill, RiAccountCircle2Line } from "react-icons/ri";
import logo from '../Pages/purrfectsitter.PNG';
import '../Styles/Login.css';
import '../Styles/Sidebar.css';

function SidebarButton({ icon, text, link, onClick }) {
    return (
        <Link to={link} className="link">
            <button className="sidebar-button" onClick={onClick}>
                {icon}
                <span>{text}</span>
            </button>
        </Link>
    );
}

function Sidebar() {
    const navigate = useNavigate();

    const logout = () => {
        console.log("Logging out...");
        localStorage.removeItem('ACCESS_TOKEN');
        localStorage.removeItem('REFRESH_TOKEN');
        console.log("Tokens removed, redirecting to login...");
        navigate('/'); // Redirect to login page after logout
    };

    return (
        <div className="sidebar">
            <div className="sidebar-top">
                <img alt="logo" className="logo" src={logo} />
                <div className="sidebar-buttons">
                    <SidebarButton icon={<RiHome2Fill />} text="Home" link="/" />
                </div>
            </div>
            <div className="sidebar-bottom">
                <SidebarButton icon={<RiAccountCircle2Line />} text="Sign in" link="/login" />
                <SidebarButton icon={<RiAccountCircle2Line />} text="Sign up" link="/signup" />
                {/* Add the onClick prop for logout button */}
                <button className="sidebar-button" onClick={logout}>
                    <RiAccountCircle2Line />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}

export default Sidebar;
