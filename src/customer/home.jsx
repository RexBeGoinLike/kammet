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
import {MapPin} from "lucide-react";

let cart = [];

export function Home() {
  return (
    <div className="p-4">
      <StoreList />
    </div>
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
    <>
      {stores.map(store => (
        <Item variant="outline" className="w-fit" key={store.id} onClick={() => navigate(`/store/${store.id}`)}>
          <ItemHeader>
            <img src={store.thumbnail} alt={store.name} className="w-100 h-75 aspect-square w-full rounded-sm object-cover"/>
          </ItemHeader>
          <ItemContent>
            <ItemTitle>{store.name}</ItemTitle>
            <ItemDescription className="flex"><MapPin />{store.location}</ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </>
  );
}