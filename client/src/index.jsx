import React from "react";
import * as ReactDOMClient from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import VerifyUser from "./components/VerifyUser";
import AuthDebug from "./components/AuthDebug";
import { Auth0Provider } from "@auth0/auth0-react";
import { AuthTokenProvider } from "./AuthTokenContext";
import { requestedScopes } from "./constants";
import "./style/workshop_o.css"
import FilePage from "./components/FilePage";
import Profile from "./components/Profile";

const container = document.getElementById("root");

const root = ReactDOMClient.createRoot(container);

// function RequireAuth({ children }) {
//   const { isAuthenticated, isLoading } = useAuth0();

//   // If the user is not authenitcated, redirect to the home page
//   if (!isLoading && !isAuthenticated) {
//     return <Navigate to="/" replace />;
//   }

//   // Otherwise, display the children (the protected page)
//   return children;
// }

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/verify-user`,
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        scope: requestedScopes.join(" "),
      }}
    >
      <AuthTokenProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/verify-user" element={<VerifyUser />} />
            <Route path="/auth-debug" element={<AuthDebug />} />
            <Route path="/file/:fileId" element={<FilePage />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </BrowserRouter>
      </AuthTokenProvider>
    </Auth0Provider>
  </React.StrictMode>
);
