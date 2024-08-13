import { useAuth0 } from "@auth0/auth0-react";
import { useParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from "react";
import Banner from "./Banner"
import '../style/workshop_o.css'

export default function FilePage() {
  // const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  const location = useLocation();
  const fileId = location.pathname.split('/file/')[1];

  // const { fileId } = useParams(); // Access the file ID from the URL

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const imgPath = `${process.env.REACT_APP_API_URL}/`
    const fetchContent = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/get-content?id=${fileId}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data.imageInd === "Internal") {
          data.image = imgPath + data.image;
        } else if (data.imageInd === "External") {

        }
        setContent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [fileId]);

  if (loading) return <p>Loading content...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!content) return <p>No content found.</p>;


  return (
    <div className="bg-sky-100 justify-item-center">
      <Banner />
      <div className="grid">
        <div className="bg-sky-100 min-h-full w-3/4 pt-8 px-4 justify-self-center grid grid-cols-2">

          <div className="grid grid-cols-2 col-span-2 ring-1 ring-slate-300 rounded-lg bg-slate-50">
            <div className="w-4/5 h-96 max-h-128 overflow-hidden ring-1 ring-slate-200 rounded-lg">
              <img src={content.image} alt={content.name} className="w-full h-full object-cover object-center max-h-full" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold pt-8 tracking-tight">{content.name}</h2>
              <h3 className="text-xl font-bold pt-8 tracking-tight">Created by {content.author.nickname}</h3>
              <p className="text-lg font-light pt-8 tracking-tight">{content.desc}</p>
            </div>

          </div>
          {/* Render more file details as needed */}
        </div>
      </div>

    </div>
  );
}