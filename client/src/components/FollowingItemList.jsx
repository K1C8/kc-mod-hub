import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const FollowingItemList = () => {
  const { user, isAuthenticated } = useAuth0();
  const items = [
    { id: 1, name: 'Placeholder Item 1', link: '', desc: 'Ipsum Lorem', thumbnail: 'https://worldlandscapearchitect.com/wp-content/uploads/2024/06/Mildred-Creak_Neurodiversity-COVER-326x245.jpg' },
    { id: 2, name: 'Placeholder Item 2', link: '', desc: 'Ipsum Lorem 2', thumbnail: 'https://worldlandscapearchitect.com/wp-content/uploads/2024/05/Southbank-Bratislava-Cover-326x245.jpg' },
    // Add more items
  ];

  return (
    <div className="grid grid-cols-3 gap-3 px-4 pt-4">
      <p className='text-xl font-bold col-span-3'>From Followed Users</p>
      {items.map((item) => (
        <a key={item.id} href={item.link} target="_blank" rel="noopener noreferrer">
          <div className="content-item bg-gray-50 rounded-xl ring-1 ring-slate-300 p-3">
            <div className="w-full h-64 max-h-80 overflow-hidden ring-1 ring-slate-300 rounded-lg">
              <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover object-center max-h-full" />
            </div>
            <h3 className="text-xl font-semibold pt-2">{item.name}</h3>
            <p className="font-light pb-2">{item.desc}</p>
          </div>
        </a>
      ))}
    </div>
  );
};

export default FollowingItemList;