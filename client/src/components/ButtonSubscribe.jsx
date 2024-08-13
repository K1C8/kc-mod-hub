import { useNavigate, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "../style/workshop_o.css"
import { useAuthToken } from "../AuthTokenContext";

async function Subscribe(user) {
    const { accessToken } = useAuthToken();
    // make a call to our API to verify the user in our database, if it doesn't exist we'll insert it into our database
    // finally we'll redirect the user to the /app route
    const data = await fetch(`${process.env.REACT_APP_API_URL}/subscibe-content`, {
        method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //     Authorization: `Bearer ${accessToken}`,
        //   },
        body: {
            "contentId": null
        }
    });
    const result = await data.json();

}

async function CheckSubscribe(contentId) {
    const { accessToken } = useAuthToken();
    const data = await fetch(`${process.env.REACT_APP_API_URL}/get-user-subscription`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const result = await data.json();
}

export default function ButtonSubscribe(contentId) {
    const { user } = useAuth0();

    CheckSubscribe(contentId)

    return (
        <button className="px-4 py-2 font-bold text-sm bg-blue-800 text-white rounded-full shadow-sm"
            onClick={() => Subscribe(user)}>
            Subscribe
        </button>
    )
}