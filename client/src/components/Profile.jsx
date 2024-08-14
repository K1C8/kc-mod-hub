import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";
import { Link } from 'react-router-dom';
import Banner from "./Banner"
import ItemList from "./ItemList";
import '../style/workshop_o.css'
import FollowedItemList from "./FollowedItemList";
import SubscribedItemList from "./SubscribedItemList"
import useSubscription from "../hooks/useSubscription";

export default function Profile() {
  const { user, loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const { accessToken } = useAuthToken();
  const [subscription, setSubscription] = useState([]);

  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Assuming it takes time for SubscribedItemList / FollowedItemList fetches data, you might need to trigger the data fetching
      // Set isFetching to false when the data is loaded
      setIsFetching(false);
    }
  }, [subscription]);

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
      console.log("From useSubscription.js, subscriptions are :");
      console.log(subscription);
    }

    subscribing();
  }, [accessToken]);

  if (isFetching) {
    return (
      <div className="bg-sky-100">
        <Banner />
        <h1 className="text-2xl px-8 font-extrabold py-8 tracking-tight">Loading...</h1>
      </div>

    ); // Show a loading message or spinner while data is being fetched
  }

  return (
    <div className="bg-sky-100">
      <Banner />
      {isFetching && <h1 className="text-2xl font-extrabold py-8 tracking-tight">Loading...</h1>}
      {isAuthenticated ? (
        <div>

          <div className="px-4">
            <h1 className="px-4 text-2xl font-extrabold py-8 tracking-tight">Your profile at Modding Hub</h1>

            <h2 className='px-4 text-xl font-bold col-span-3'>Contents You Subscribbed</h2>

            {/* <SubscribedItemList /> */}
            <ul className="grid grid-cols-3 gap-3 px-4 pb-4">
              {subscription.map((sub) => (
                <Link key={sub.content.id + 10000000} to={"/file/" + String(sub.content.id)}>
                  <div className="content-item bg-gray-50 rounded-xl ring-1 ring-slate-300 p-3">
                    <div className="w-full h-64 max-h-80 overflow-hidden ring-1 ring-slate-300 rounded-lg">
                      <img src={sub.content.image} alt={sub.content.name} className="w-full h-full object-cover object-center max-h-full" />
                    </div>
                    <h3 className="text-xl font-semibold pt-2">{sub.content.name}</h3>
                    <p className="font-light pb-2">{sub.content.desc}</p>
                  </div>
                </Link>
              ))}
            </ul>

            {/* end of SubscribedItemList  */}
            <FollowedItemList />

          </div>
        </div>) : (
        <div>
          <p className="text px-4 py-4 tracking-tight">Welcome to the Modding Hub!</p>
          <ItemList />
          <h1 className="text-2xl font-extrabold px-4 py-8 tracking-tight">Log in to view your profile at Modding Hub</h1>
        </div>
      )

      }
    </div>
  );
}