import React from 'react';

const ItemList = () => {
  const items = [
    { id: 1, name: 'Item 1', thumbnail: '/images/item1.jpg', link: '' },
    { id: 2, name: 'Item 2', thumbnail: '/images/item2.jpg', link: '' },
    // Add more items
  ];

  return (
    <div className="flex py-10">
        <div className="grid grid-cols-3 gap-3 w-3/4 px-8">
        {items.map((item) => (
          <a key={item.id} href={item.link} target="_blank" rel="noopener noreferrer">
            <div  className="content-item bg-gray-50 rounded-xl ring-1 ring-slate-300 p-3">
              <img src={item.thumbnail} alt={item.name} className="content-item-image" />
              <h3 className="text-xl font-semibold">{item.name}</h3>
              <p className="font-light">View More</p>
            </div>
          </a>
        ))}
        </div>
        <div className="content-menu mx-3 p-3 bg-slate-50 rounded-xl ring-1 ring-slate-300">
            <h2>Introduction</h2>
            <p>Click the search icon in the nav bar to activate search input, searching function not implemented though.</p>
            <p>Click the Pride button to change background and text color of some of the nav bar items by adding and removing
                CSS classes.
                </p>
        </div>
    </div>
  );
};

export default ItemList;