import { useAuth0 } from "@auth0/auth0-react";
import Banner from "./Banner"
import ItemList from "./ItemList";
import '../style/workshop_o.css'

export default function Profile() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  return (
    <div className="bg-sky-100">
      <Banner />
      <h1 className="text-2xl font-extrabold px-4 py-8 tracking-tight">Your profile at Modding Hub</h1>
      <h2 className="text-xl font-bold px-4 py-4 tracking-tight">Files you subscribed</h2>
      <p>Placeholder</p>
      <p className="text px-4 py-4 tracking-tight">Welcome to the Modding Hub!</p>
      <ItemList />
    </div>
  );
}