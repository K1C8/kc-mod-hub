import { useAuth0 } from "@auth0/auth0-react";
import Banner from "./Banner"
import ItemList from "./ItemList";
import '../style/workshop_o.css'

export default function Home() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  return (
    <div className="bg-sky-100">
      <Banner />
      <h1 className="text-2xl font-extrabold px-4 pt-8 tracking-tight">Modding Hub</h1>
      <p className="text px-4 py-4 tracking-tight">Welcome to the Modding Hub!</p>
      <ItemList />
    </div>
  );
}
