import { useAuth0 } from "@auth0/auth0-react";
import Banner from "./Banner"
import ItemList from "./ItemList";
import '../style/workshop_o.css'

export default function Home() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  return (
    <div className="bg-sky-100">
      <Banner />
      <h1 className="text-2xl font-extrabold px-8 py-8">Modding Hub</h1>
      <p className="text px-8 py-4">Welcome to the Modding Hub!</p>
      <ItemList />
    </div>
  );
}
