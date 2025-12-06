import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { user } from '../dataaccess/usermanager.js'
import { fetchStoreList } from '../dataaccess/storelistmanager.js';

export function Home() {
  const navigate = useNavigate();

  return (
    <>
      <h1> Hello {user.email} </h1>
      <nav>
         <input
            type="text" 
          />
      </nav>
      <StoreList />
    </>
  );
}

function StoreList() {
  const [stores, setStores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      const data = await fetchStoreList();
      setStores(data);
    }
    getData();
  }, []);

  return (
    <div>
      {stores.map(store => (
        <div
          key={store.id}
          onClick={() => navigate(`/store/${store.id}`)}
        >
          <h3>{store.name}</h3>
          <p>{store.location}</p>
        </div>
      ))}
    </div>
  );

}