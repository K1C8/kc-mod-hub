import { useAuth0 } from "@auth0/auth0-react";
import { useAuthToken } from "../AuthTokenContext";
import Banner from "./Banner";

export default function AuthDebug() {
  const { user, loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const { accessToken } = useAuthToken();

  return (
    <div className="bg-sky-100">
      <Banner />
      <div className="p-10">
        {/* <button className="btn-primary" onClick={loginWithRedirect}>
          Login
        </button> */}
        <p>Loading: {String(isLoading)} </p>
        <p>User Authenticated: {String(isAuthenticated)}</p>
        <div className="py-4">
          <p>Access Token:</p>
          <pre>{JSON.stringify(accessToken, null, 2)}</pre>
        </div>
        <div className="py-4">
          <p>User Info</p>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
        <div className="py-4">
          <p>User Display Name</p>
          <pre>{String(user.nickname)}</pre>
        </div>
        <div className="py-4">
          <p>User Picture</p>
          <img src={String(user.picture)} className="inline-block h-12 w-12 rounded-full ring-2 ring-slate-200"></img>
        </div>
      </div>
    </div>
  );
}
