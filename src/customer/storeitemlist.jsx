import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "./cartcontext";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "./../components/ui/dialog";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "./../components/ui/item"
import { Button } from "./../components/ui/button";
import { Input } from "./../components/ui/input";

export function StoreItemList() {
  return <GenerateStoreItemList/>;
}

function GenerateStoreItemList() {

  const [items, setItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const { id } = useParams();

  const { cart, addToCart, isCartOpen, openCart, closeCart } = useCart();

  useEffect(() => {
    fetch(`/.netlify/functions/getStoreItemList?id=${id}`)
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error(err));
  }, []);

  const updateQuantity = (id, value) => {
    setQuantities(prev => ({ ...prev, [id]: Number(value) }));
  };

  return (
    <div className="flex flex-col gap-2 p-4">
      <Button className="mb-4 ml-auto h-10" size="sm" onClick={openCart}>
        <ShoppingCart />({Object.keys(cart).length})
      </Button>

      <Dialog open={isCartOpen} onOpenChange={closeCart}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cart</DialogTitle>
            <DialogDescription>Your Items</DialogDescription>
          </DialogHeader>

        <div className="flex w-full max-w-md flex-col gap-6"> 
            {(Object.values(cart).map(cartItem => 
                <Item key={cartItem.id} variant="outline"> 
                    <ItemContent> 
                        <ItemTitle>{cartItem.title}</ItemTitle> 
                        <ItemDescription>{cartItem.description}</ItemDescription> 
                    </ItemContent>
                    <ItemActions>
                        <ChangeQuantity item={cartItem} quantities={quantities} updateQuantity={updateQuantity} />
                    </ItemActions>
                </Item>
            ))}
        </div>
        </DialogContent>
      </Dialog>
      <div className="flex flex-col gap-4">
        {items.map(item => (
            <Item key={item.id} variant="outline"> 
                <ItemContent> 
                    <ItemTitle>{item.title}</ItemTitle> 
                    <ItemDescription>{item.description}</ItemDescription>
                    <ItemDescription>Php {item.price}</ItemDescription>
                </ItemContent> 
                <ItemActions>
                    <ChangeQuantity item={item} quantities={quantities} updateQuantity={updateQuantity} />
                    <Button
                        onClick={() => {
                        addToCart(item, quantities[item.id] || 1);
                        openCart();
                    }}
                    >Add to Cart</Button>
                </ItemActions>
            </Item>
        ))}
      </div>
    </div>
  );
}

function ChangeQuantity(props) {
    const { item, quantities, updateQuantity } = props;
    return (<>
        <Button 
        variant="outline" 
        size="icon" 
        aria-label="Subtract"
        onClick={() => {
                updateQuantity(item.id, (quantities[item.id] || 1) - 1);
        }}>
            <Minus />
        </Button>
        <Input
            className="w-16"
            type="number"
            min="1"
            value={quantities[item.id] || 1}
            onChange={(e) => updateQuantity(item.id, e.target.value)}
        />
        <Button 
            variant="outline" 
            size="icon" 
            aria-label="Add"
            onClick={() => {
                updateQuantity(item.id, (quantities[item.id] || 1) + 1);
        }}>
            <Plus />
        </Button>
    </>);
}
