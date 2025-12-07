import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "./../components/ui/item"

let cart = [];

export function Home() {
  return (
    <>
      <h1> Store List </h1>
      <StoreList />
    </>
  );
}

function StoreList() {
  const [stores, setStores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/.netlify/functions/getStoreList")
      .then((res) => res.json())
      .then((data) => setStores(data))
      .catch((err) => console.error(err));
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