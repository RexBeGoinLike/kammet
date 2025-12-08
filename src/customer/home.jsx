import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { auth } from './../dataaccess/firebase';

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
  const [orderhistory, setOrderHistory] = useState([]);

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

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
    const res = await fetch(`/.netlify/functions/getOrderHistory?id=${auth.currentUser.uid}`)
      .then((res) => res.json())
      .then((data) => setOrderHistory(data))
      .catch((err) => console.error(err));
  }

  async function cancelOrder(orderId) {
      const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
      
      if (!confirmCancel) return;

      fetch('/.netlify/functions/cancelOrder', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          orderId: orderId,
          userId: auth.currentUser.uid
      }),
      })
      .then(res => res.json())
      .then(data => {
          alert("Order cancelled successfully");
          getHistory();
      })
      .catch(err => {
          console.error("Error cancelling order:", err);
          alert("Failed to cancel order");
      });
  }

  return (
    <div className="flex flex-col items-center" >

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger variant="none" size="icon  " className="flex mb-4 p-0 self-start justify-start items-center">
              <History className="h-4 w-4 mr-2"/> 
              Order History
          </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order History</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2 max-h-[80vh] overflow-y-auto pr-1">

            {orderhistory.map((order) => (
              <Item variant="outline" className="w-full" key={order.id}>
                  <ItemContent>
                    <ItemTitle>Order #{order.id}</ItemTitle>
                    <ItemDescription className="flex">Location: {order.location}</ItemDescription>
                    <ItemDescription className="flex">Payment Method: {order.paymentmethod}</ItemDescription>
                    <ItemDescription className="flex">Total: Php {order.total}</ItemDescription>
                    <ItemDescription className="flex">Status: {order.status}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Button variant="outline" disabled={order.status != "Pending"} onClick={() => cancelOrder(order.id)}>Cancel</Button>
                  </ItemActions>
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