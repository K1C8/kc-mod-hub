import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import ItemListStub from './ItemListStub';

const ItemList = () => {
  const { user, isAuthenticated } = useAuth0();
  const ItemsStub = ItemListStub;
  const [files, setFiles] = useState([]);

  useEffect(() => {
    // Fetch the data from the backend
    fetch('/get-files')
      .then(response => response.json())
      .then(data => setFiles(data))
      .catch(error => console.error('Error fetching files:', error));
  }, []);

  return (
    <div className="grid grid-cols-3 gap-3 px-4 pb-4">
      <p className='text-xl font-bold col-span-3'>Most Recent Files</p>
      {files.map((item) => (
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

export default ItemList;