import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import ItemListStub from './ItemListStub';
import useContents from '../hooks/getContents'

export default function ItemList () {
  const { user, isAuthenticated } = useAuth0();
  const ItemsStub = ItemListStub;
  const [contents, setContents] = useContents([]);

  const imgPath = `${process.env.REACT_APP_API_URL}/`

  return (
    <div className="grid grid-cols-3 gap-3 px-4 pb-4">
      <p className='text-xl font-bold col-span-3'>Most Recent Files</p>
      {contents.map((content) => (
        <a key={content.id} href={"/file/:" + String(content.id)} target="_blank" rel="noopener noreferrer">
          <div className="content-item bg-gray-50 rounded-xl ring-1 ring-slate-300 p-3">
            <div className="w-full h-64 max-h-80 overflow-hidden ring-1 ring-slate-300 rounded-lg">
              <img src={imgPath + content.image} alt={content.name} className="w-full h-full object-cover object-center max-h-full" />
            </div>
            <h3 className="text-xl font-semibold pt-2">{content.name}</h3>
            <p className="font-light pb-2">{content.desc}</p>
          </div>
        </a>
      ))}
    </div>
  );
};
