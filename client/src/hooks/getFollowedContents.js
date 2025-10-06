// import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";

// this is a custom hook that fetches the contents items from the API
// custom hooks are a way to share logic between components
export default function useFollowedContents(user) {
    const { accessToken } = useAuthToken();
    const [contents, setContents] = useState([]);
    useEffect(() => {
        if (!accessToken) return; // wait for Auth0 to deliver the token

        async function getFollowedContentsFromApi() {
            try {
                // fetch the followed contents from the API, passing the access token in the Authorization header
                const data = await fetch(`${process.env.REACT_APP_API_URL}/get-followed-contents`, {
                    method: "GET",
                    headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                    },
                });
                const contents = await data.json();

                setContents(contents);
            } catch (e) {
                console.error("Failed to load followed contents from the API.", e);
            }                
        }

        getFollowedContentsFromApi();        
    }, [user, accessToken]);

    return [contents, setContents];
}
