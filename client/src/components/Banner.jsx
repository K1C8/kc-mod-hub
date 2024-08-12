import "../style/workshop.css";

import { useNavigate, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function Banner() {
    const navigate = useNavigate();
    const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
    const signUp = () => loginWithRedirect({ screen_hint: "signup" });

    return (
        <nav className="nav-menu">
            {isAuthenticated ? (
                <ul className="nav-menu-items" id="top-half-nav-menu">
                    <li className="nav-menu-item">
                        <Link to="/app">Home</Link>
                    </li>
                    <li className="nav-menu-item">
                        <Link to="/app/profile">Profile</Link>
                    </li>
                    <li className="nav-menu-item">
                        <Link to="/app/debugger">Auth Debugger</Link>
                    </li>
                    <li className="nav-menu-item">
                        <div>Welcome 👋 {user.name} </div>
                    </li>
                    <li className="nav-menu-item">
                        <button
                            className="exit-button"
                            onClick={() => logout({ returnTo: window.location.origin })}
                        >
                            LogOut
                        </button>
                    </li>
                    
                </ul>
                ) : (
                <ul className="nav-menu-items" id="top-half-nav-menu">
                    <li className="nav-menu-item">
                        <Link to="/app">Home</Link>
                    </li>  

                    <li className="nav-menu-item">
                        <button className="btn-primary" onClick={loginWithRedirect}>
                            Login
                        </button>
                    </li>
                    <li className="nav-menu-item">
                        <button className="btn-secondary" onClick={signUp}>
                            Create Account
                        </button>
                    </li>                  
                        
                </ul>    
                )
            }
        </nav>
    )
}