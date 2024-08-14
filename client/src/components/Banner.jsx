import { useNavigate, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "../style/workshop_o.css"
import AuthDebug from "./AuthDebug";

export default function Banner() {
    const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
    const signUp = () => loginWithRedirect({ screen_hint: "signup" });

    return (
        <nav className="sticky top-0 py-4 px-5 bg-slate-100 ring-1 ring-slate-300">
            {isAuthenticated ? (
                <ul className="nav-menu-items flex place-content-evenly" id="top-half-nav-menu">
                    <li className="nav-menu-item">
                        <Link to="/">Home</Link>
                    </li>
                    <li className="nav-menu-item">
                        <Link to="/profile">Profile</Link>
                    </li>
                    <li className="nav-menu-item">
                        <div>Welcome, {user.nickname} </div>
                    </li>
                    <li className="nav-menu-item">
                        <Link to="/auth-debug">Auth Debugger</Link>
                    </li>
                    <li className="nav-menu-item">
                        <button
                            className="px-4 py-2 font-bold text-sm bg-cyan-800 text-white rounded-full shadow-sm"
                            onClick={() => logout({ returnTo: window.location.origin })}
                        >
                            Log Out
                        </button>
                    </li>

                </ul>
            ) : (
                <ul className="nav-menu-items flex place-content-evenly" id="top-half-nav-menu">
                    <li className="nav-menu-item">
                        <Link to="/">Home</Link>
                    </li>

                    <li className="nav-menu-item">
                        <button className="px-4 py-2 font-bold text-sm bg-cyan-800 text-white rounded-full shadow-sm"
                            onClick={loginWithRedirect}>
                            Login
                        </button>
                    </li>
                    <li className="nav-menu-item">
                        <button className="px-4 py-2 font-bold text-sm bg-blue-800 text-white rounded-full shadow-sm"
                            onClick={signUp}>
                            Create Account
                        </button>
                    </li>

                </ul>
            )
            }
        </nav>
    )
}