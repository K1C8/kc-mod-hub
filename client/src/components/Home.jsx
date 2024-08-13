import { useAuth0 } from "@auth0/auth0-react";
import Banner from "./Banner"
import ItemList from "./ItemList";
import '../style/workshop_o.css'
import SideBar from "./SideBar";
import FollowedItemList from "./FollowedItemList";

export default function Home() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  return (
    <div className="bg-sky-100 min-h-full">
      <Banner />
      <h1 className="text-2xl font-extrabold px-8 pt-8 tracking-tight">Modding Hub</h1>
      <p className="text px-8 py-4 tracking-tight">Welcome to the Modding Hub!</p>
      {/* Display items by the followed users if logged in.*/}
      <div className="flex py-10">
        <div className="grid grid-rows-3 gap-3 w-3/4 px-4">
          <ItemList />
          {isAuthenticated && <FollowedItemList />}
        </div>
        <SideBar />
      </div>
    </div>
  );
}
