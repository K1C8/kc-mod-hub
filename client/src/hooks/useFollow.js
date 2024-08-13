import { useState, useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";

export default function useFollow() {
    const [followed, setFollowed] = useState([]);
    const { accessToken } = useAuthToken();

    // AuthToken will be checked at the back-end during unsubscribbing content. 
    useEffect(() => {
        async function getFollowed() {
            const data = await fetch(`${process.env.REACT_APP_API_URL}/get-followed-user`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                }
            });
            const result = await data.json();
            setFollowed(result);
        }

        getFollowed();
    }, [accessToken]);


    return [followed, setFollowed];

}