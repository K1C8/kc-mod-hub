import { useAuth0 } from "@auth0/auth0-react";
import { useParams, useLocation, useRevalidator } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";
import Banner from "./Banner"
import '../style/workshop_o.css'
import useSubscription from "../hooks/useSubscription";
import useFollow from "../hooks/useFollow";

export default function FilePage() {
  const { isAuthenticated } = useAuth0();
  const { accessToken } = useAuthToken();

  const location = useLocation();
  const fileId = location.pathname.split('/file/')[1];

  // const { fileId } = useParams(); // Access the file ID from the URL

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscription, setSubscription] = useSubscription();
  const [followed, setFollowed] = useFollow();

  async function addSubscription(fileId) {
    // insert a new subscription item, passing the accessToken in the Authorization header
    const data = await fetch(`${process.env.REACT_APP_API_URL}/subscibe-content`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        contentId: fileId,
      }),
    });
    if (data.ok) {
      const subscription = await data.json();
      return subscription;
    } else {
      return null;
    }
  }

  async function delSubscription(fileId) {
    // remove a subscription item, passing the accessToken in the Authorization header
    const data = await fetch(`${process.env.REACT_APP_API_URL}/unsubscibe-content`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        contentId: fileId,
      }),
    });
    if (data.ok) {
      const subscription = await data.json();
      return subscription;
    } else {
      return null;
    }
  }

  async function addFollow(fileId) {
    // insert a new subscription item, passing the accessToken in the Authorization header
    const data = await fetch(`${process.env.REACT_APP_API_URL}/follow-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        followUserId: fileId,
      }),
    });
    if (data.ok) {
      const subscription = await data.json();
      return subscription;
    } else {
      return null;
    }
  }

  function ButtonSubscribe() {
    const isSubscribed = subscription.find((sub) => parseInt(sub.contentId) === parseInt(fileId));
    console.log(isSubscribed);

    if (isSubscribed) {
        return (
            <button className="px-4 py-2 font-bold text-sm bg-pink-800 text-white rounded-full shadow-sm"
                onClick={() => handleUnsubscribbing()}>
                Unsubscribe
            </button>
        )
    } else {
        return (
            <button className="px-4 py-2 font-bold text-sm bg-blue-800 text-white rounded-full shadow-sm"
                onClick={() => handleSubscribbing()}>
                Subscribe
            </button>
        )
    }
  }

  function ButtonFollow() {
    const isFollowed = () => {
      for (let i = 0; i < followed.length(); i++) {
        if (followed[i] === 1)
          return true;
      }
      return false;
    };
    console.log(isFollowed);

    if (isFollowed) {
        return (
            <button className="px-4 py-2 font-bold text-sm bg-pink-800 text-white rounded-full shadow-sm"
                onClick={() => handleUnfollowing()}>
                Unfollow
            </button>
        )
    } else {
        return (
            <button className="px-4 py-2 font-bold text-sm bg-blue-800 text-white rounded-full shadow-sm"
                onClick={() => handleFollowing()}>
                Follow
            </button>
        )
    }
  }

  const handleSubscribbing = async () => {
    const newSubscription = await addSubscription(fileId);
    if (newSubscription) {
      setSubscription([...subscription, newSubscription]);
    }
  };

  const handleUnsubscribbing = async () => {
    const subscriptionToDel = await delSubscription(fileId);
    if (subscriptionToDel) {
      let subscriptionCopy = [...subscription];
      let delIndex = subscriptionCopy.indexOf(subscriptionToDel);
      if (delIndex > -1) {
        subscriptionCopy.splice(delIndex, 1);
      }
      setSubscription([...subscriptionCopy]);
    }
  };

  const handleFollowing = async () => {
    const newFollowed = await addFollow(fileId);
    if (newFollowed) {
      setSubscription([...followed, newFollowed]);
    }
  };

  const handleUnfollowing = async () => {
    const followedToDel = await delFollow(fileId);
    if (followedToDel) {
      let followedCopy = [...followed];
      let delIndex = followedCopy.indexOf(followedToDel);
      if (delIndex > -1) {
        followedCopy.splice(delIndex, 1);
      }
      setSubscription([...followedCopy]);
    }
  };

  useEffect(() => {
    // const imgPath = `${process.env.REACT_APP_API_URL}/`
    const fetchContent = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/get-content?id=${fileId}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        // if (data.imageInd === "Internal") {
        //   data.image = imgPath + data.image;
        // } else if (data.imageInd === "External") {

        // }
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
              <h2 className="text-2xl font-extrabold pt-4 tracking-tight">{content.name}</h2>
              <h3 className="text-xl font-bold pt-4 tracking-tight">Uploaded by {content.author.nickname}</h3>
              <p className="text-lg font-light pt-4 tracking-tight"></p>
              {isAuthenticated ? (ButtonFollow()) : (
                <p className="text-lg font-semibold tracking-tight">Log in to Follow User</p>
              )}
              <p className="text-lg font-light py-4 tracking-tight">{content.desc}</p>
              {isAuthenticated ? (ButtonSubscribe()) : (
                <p className="text-lg font-semibold tracking-tight">Log in to Subscribe Content</p>
              )}
            </div>

          </div>
          {/* Render more file details as needed */}
        </div>
      </div>

    </div>
  );
}