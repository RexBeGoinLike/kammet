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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./../components/ui/dialog"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "./../components/ui/item"
import { Button } from './../components/ui/button';
import { MapPin, History } from "lucide-react";
import { auth } from '@/dataaccess/firebase';

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

  const [open, setOpen] = useState(false);
  const [orderhistory, setOrderHistory] = useState(null);

  useEffect(() => {
    fetch("/.netlify/functions/getStoreList")
      .then((res) => res.json())
      .then((data) => setStores(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (open) {
      getHistory();
    }
  }, [open]);

  async function getHistory() {
    const res = await fetch(`/.netlify/functions/getStoreList?id=${auth.currentUser.uid}`)
      .then((res) => res.json())
      .then((data) => setOrderHistory(data))
      .catch((err) => console.error(err));
  }

  return (
    <div className="flex flex-col items-center">
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger variant="outline" className="mb-4 self-end">
              <History/> 
          </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order History</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            {orderhistory.map((order) => (
              <Item variant="outline" className="w-fit" key={order.id}>

              </Item>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {stores.map(store => (
        <Item variant="outline" className="w-fit" key={store.id} onClick={() => navigate(`/store/${store.id}`)}>
          <ItemHeader>
            <img src={store.thumbnail} alt={store.name} className="h-75 aspect-square w-full rounded-sm object-cover object-top"/>
          </ItemHeader>
          <ItemContent>
            <ItemTitle>{store.name}</ItemTitle>
            <ItemDescription className="flex"><MapPin />{store.location}</ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </div>
  );
}