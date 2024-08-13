import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import ItemListStub from './ItemListStub';
import useFollowedContents from '../hooks/getFollowedContents'
import { Link } from 'react-router-dom';

const FollowedItemList = () => {
  const { user, isAuthenticated } = useAuth0();
  const [contents, setContents] = useFollowedContents(user);

  if (contents != null) 
    return (
      <div className="grid grid-cols-3 gap-3 px-4 pb-4">
        <p className='text-xl font-bold col-span-3'>Contents From Users You Followed</p>
        {contents.map((content) => (
          <Link key={content.id} to={"/file/" + String(content.id)}>
            <div className="content-item bg-gray-50 rounded-xl ring-1 ring-slate-300 p-3">
              <div className="w-full h-64 max-h-80 overflow-hidden ring-1 ring-slate-300 rounded-lg">
                <img src={content.image} alt={content.name} className="w-full h-full object-cover object-center max-h-full" />
              </div>
              <h3 className="text-xl font-semibold pt-2">{content.name}</h3>
              <p className="font-light pb-2">{content.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    );
};

export default FollowedItemList;