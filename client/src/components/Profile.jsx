import { useAuth0 } from "@auth0/auth0-react";
import { useAuthToken } from "../AuthTokenContext";
import Banner from "./Banner"
import ItemList from "./ItemList";
import '../style/workshop_o.css'
import FollowedItemList from "./FollowedItemList";
import SubscribedItemList from "./SubscribedItemList"

export default function Profile() {
  const { user, loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const { accessToken } = useAuthToken();

  return (
    <div className="bg-sky-100">
      <Banner />
      {isAuthenticated ? (
        <div>
          
          <div className="px-4">
            <h1 className="text-2xl font-extrabold py-8 tracking-tight">Your profile at Modding Hub</h1>
            <SubscribedItemList />
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