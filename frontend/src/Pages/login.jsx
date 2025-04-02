import logo from './purrfectsitter.PNG';
import { RiHome2Fill, RiStarFill, RiAccountCircle2Line, RiQuestionLine } from "react-icons/ri";
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from "../api";
import "../Styles/Login.css";
import Sidebar from "../components/Sidebar";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(""); // State for errors
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");
    
        try {
            // API request for login, sending username and password
            const res = await api.post("/api/token/", { username, password });
    
            console.log("Login response:", res.data); // Log the full response
    
            // Store the access and refresh tokens in local storage
            localStorage.setItem("access_token", res.data.access);
            localStorage.setItem("refresh_token", res.data.refresh);

            // Check the role and navigate to the appropriate profile page
            if (res.data.role === 'owner') {
                navigate("/ownerprofilepage");
            } else if (res.data.role === 'minder') {
                navigate("/minderprofilepage");
            } else {
                setErrorMessage("Unknown role");
            }
        } catch (error) {
            console.error("Error during login: ", error.response || error);
            setErrorMessage("Invalid username or password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            {/* Sidebar */}
            <Sidebar />

            {/* Login Form */}
            <div className="login-form">
                <div className="login-title">Sign in to PurrfectSitter</div>

                {/* Error message div above input fields */}
                {errorMessage && <div className="error-box">{errorMessage}</div>}

                <form onSubmit={handleSubmit} className="login-form-fields">
                    <input 
                        className="form-input"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                    />
                    <input 
                        className="form-input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password" 
                    />
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div className="signup-link">Don't have an account? <Link to={"/signup"} className="link"><span>Sign up</span></Link></div>
                <div className="forgot-password">Forgot your password?</div>
            </div>
        </div>
    );
}

export default Login;
