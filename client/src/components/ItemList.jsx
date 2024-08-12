import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const ItemList = () => {
  const { user, isAuthenticated } = useAuth0();
  const items = [
    { id: 1, name: 'Placeholder Item 1', link: '', thumbnail: 'https://worldlandscapearchitect.com/wp-content/uploads/2024/06/Mildred-Creak_Neurodiversity-COVER-326x245.jpg' },
    { id: 2, name: 'Placeholder Item 2', link: '', thumbnail: 'https://worldlandscapearchitect.com/wp-content/uploads/2024/05/Southbank-Bratislava-Cover-326x245.jpg' },
    // Add more items
  ];

  return (
    <div className="flex py-10">
      <div className="grid grid-cols-3 gap-3 w-3/4 px-4">
        {items.map((item) => (
          <a key={item.id} href={item.link} target="_blank" rel="noopener noreferrer">
            <div className="content-item bg-gray-50 rounded-xl ring-1 ring-slate-300 p-3">
              <div class="w-full h-64 max-h-80 overflow-hidden ring-1 ring-slate-300 rounded-lg">
                <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover object-center max-h-full" />
              </div>
              <h3 className="text-xl font-semibold pt-2">{item.name}</h3>
              <p className="font-light pb-2">View More</p>
            </div>
          </a>
        ))}
      </div>
      <div className="content-menu mx-3 bg-slate-50 rounded-xl ring-1 ring-slate-300 gap-3 w-1/4">
        <div className="m-4 ring-1 ring-slate-300 rounded-lg min-h-12">
          <p className="inline-block align-middle h-full">Searchbar placeholder</p>
        </div>
        {isAuthenticated ? (

          <div className="p-4 grid grid-flow-row-dense grid-cols-3">
            <img src={String(user.picture)} alt="Your Avatar" className="inline-block size-24 rounded-full ring-2 ring-slate-200"></img>
            <div className="col-span-2">
              <p className="text-xl font-semibold">{String(user.nickname)}</p>
              <p className="text font-light">Files you subscribed</p>
            </div>
          </div>
        ) : (

          <div className="p-4">
            <p>
              Log in to view your subscription list.
            </p>

          </div>)
        }
        <div className="p-4">
          <h2>Introduction</h2>
          <p>Click the search icon in the nav bar to activate search input, searching function not implemented though.</p>
          <p>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ItemList;