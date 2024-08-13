import { useState, useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";

export default function useSubscription() {
    const [subscription, setSubscription] = useState([]);
    const { accessToken } = useAuthToken();

    // AuthToken will be checked at the back-end during unsubscribbing content. 
    useEffect(() => {
        async function subscribing() {
            const data = await fetch(`${process.env.REACT_APP_API_URL}/get-user-subscription`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                }
            });
            const result = await data.json();
            setSubscription(result);
            console.log("From useSubscription.js, subscriptions are :");
            console.log(subscription);
        }

        subscribing();
    }, [accessToken]);


    return [subscription, setSubscription];

}