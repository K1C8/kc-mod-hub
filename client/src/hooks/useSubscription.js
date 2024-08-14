import { useState, useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";

export default function useSubscription() {
    const [subscription, setSubscription] = useState([]);
    const { accessToken } = useAuthToken();
    const [isFetching, setIsFetching] = useState(true);

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
            setIsFetching(false);
            // console.log("From useSubscription.js, subscriptions are :");
            // console.log(subscription);
        }

        subscribing();
    }, [isFetching]);


    return [subscription, setSubscription];

}