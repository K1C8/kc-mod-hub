import { useAuth0 } from "@auth0/auth0-react";

export default function Home() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  return (
    <div className="home">
      <h1>Assignment 3</h1>
      <div>
        <button className="btn-primary" onClick={loginWithRedirect}>
          Login
        </button>
        <p>Loading: {String(isLoading)} </p>
        <p>User Authenticated: {String(isAuthenticated)}</p>
      </div>
    </div>
  );
}
