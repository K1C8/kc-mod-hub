
import { useAuth0 } from '@auth0/auth0-react';
import ItemListStub from './ItemListStub';
import useContents from '../hooks/getContents'
import { Link } from 'react-router-dom';

export default function ItemList () {
  const { user, isAuthenticated } = useAuth0();
  const ItemsStub = ItemListStub;
  const [contents, setContents] = useContents([]);

  return (
    <div className="grid grid-cols-3 gap-3 px-4 pb-4">
      <h2 className='text-xl font-bold col-span-3'>Most Recent Files</h2>
      {contents.map((content) => (
        <Link key={content.id} to={"/file/" + String(content.id)}>
          <div className="bg-gray-50 h-96 max-h-96 overflow-hidden rounded-xl ring-1 ring-slate-300 p-3">
            <div className="w-full h-60 max-h-60 overflow-hidden ring-1 ring-slate-300 rounded-lg">
              <img src={content.image} alt={content.name} className="w-full h-full object-cover object-center max-h-full" />
            </div>
            <h3 className="text-xl font-semibold py-2">{content.name}</h3>
            <p className="font-medium pb-2">Uploaded by: {content.author.nickname}</p>
            <p className="font-light pb-2">{content.desc}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};
