import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import useSubscription from '../hooks/useSubscription';

const SubscribedItemList = () => {
  const { user, isAuthenticated } = useAuth0();
  const [subscription, setSubscription] = useSubscription();

  if (subscription != null) 
    console.log(subscription)
    return (
      <ul className="grid grid-cols-3 gap-3 px-4 pb-4">
        <p className='text-xl font-bold col-span-3'>Contents You Subscribbed</p>
        {subscription.map((sub) => (
          <Link key={sub.id} to={"/file/" + String(sub.id)}>
            <div className="content-item bg-gray-50 rounded-xl ring-1 ring-slate-300 p-3">
              <div className="w-full h-64 max-h-80 overflow-hidden ring-1 ring-slate-300 rounded-lg">
                <img src={sub.image} alt={sub.name} className="w-full h-full object-cover object-center max-h-full" />
              </div>
              <h3 className="text-xl font-semibold pt-2">{sub.name}</h3>
              <p className="font-light pb-2">{sub.desc}</p>
            </div>
          </Link>
        ))}
      </ul>
    );
};

export default SubscribedItemList;