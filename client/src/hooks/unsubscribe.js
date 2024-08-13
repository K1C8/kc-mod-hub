import { useState, useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";

export default function Unsubscribe() {
    const [contents, setContents] = useState([]);

    const { accessToken } = useAuthToken();
    // AuthToken will be checked at the back-end during unsubscribbing content. 
    useEffect(() => {
        async function unsubscibbing() {
            const data = await fetch(`${process.env.REACT_APP_API_URL}/unsubscibe-content`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: {
                    "contentId": null
                }
            });
            const result = await data.json();
            setContents(result);
        }

        unsubscibbing();
    }, []);


    return [contents, setContents];

}