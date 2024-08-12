import React from 'react';

const ItemList = () => {
  const items = [
    { id: 1, name: 'Item 1', thumbnail: '/images/item1.jpg', link: '' },
    { id: 2, name: 'Item 2', thumbnail: '/images/item2.jpg', link: '' },
    // Add more items
  ];

  return (
    <div className="content-containter">
        <div className="content-list grid">
        {items.map((item) => (
            <div key={item.id} className="content-item bg-gray-50 rounded-xl ring-1 ring-slate-300">
            <img src={item.thumbnail} alt={item.name} className="content-item-image" />
            <h3 className="content-item-title">{item.name}</h3>
            <a href={item.link} target="_blank" rel="noopener noreferrer">View More</a>
            </div>
        ))}
        </div>
        <div className="content-menu">
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