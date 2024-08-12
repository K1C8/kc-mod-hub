import { useAuth0 } from "@auth0/auth0-react";
import Banner from "./Banner"
import ItemList from "./ItemList";
import '../style/workshop_o.css'

export default function Home() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  return (
    <div className="bg-sky-100">
      <Banner />
      <h1>Modding Hub</h1>
      <ItemList />
    </div>
  );
}
