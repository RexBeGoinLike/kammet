import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "./cartcontext";
import { Minus, Plus, ShoppingCart, ArrowLeft } from "lucide-react";
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
  ItemHeader,
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
    const navigate = useNavigate();
    
    useEffect(() => {
        fetch(`/.netlify/functions/getStoreItemList?id=${id}`)
        .then(res => res.json())
        .then(data => setItems(data))
        .catch(err => console.error(err));
    }, []);

    const updateQuantity = (id, value) => {
        if (value < 1) value = 1;
        setQuantities(prev => ({ ...prev, [id]: Number(value) }));
    };

    return (
        <div className=" gap-2 p-4">
            <div className="text-2xl font-bold mb-4 flex flex-row justify-between">
                <Button className="mb-4 h-10" size="icon" onClick={() => navigate("/home")}>
                    <ArrowLeft />
                </Button>
                <Button className="mb-4 h-10" size="sm" onClick={openCart}>
                    <ShoppingCart />({Object.keys(cart).length})
                </Button>
            </div>

            <Dialog open={isCartOpen} onOpenChange={closeCart}>
                <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cart</DialogTitle>
                    <DialogDescription>Your Items</DialogDescription>
                </DialogHeader>

                <div className="flex w-full max-w-md flex-col gap-6"> 
                    {(Object.values(cart).map(cartItem => 
                        <Item key={cartItem.id} variant="outline"> 
                            <ItemMedia> 
                                <img src={cartItem.thumbnail} alt={cartItem.title} className="w-24 h-auto object-cover rounded-md" /> 
                            </ItemMedia> 
                            <ItemContent> 
                                <ItemTitle>{cartItem.title}</ItemTitle> 
                                <ItemDescription>Php {cartItem.price} * {(quantities[cartItem.id] || 1)}</ItemDescription>
                                <ItemDescription>Total: Php {cartItem.price * (quantities[cartItem.id] || 1)}</ItemDescription>
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
                        <ItemMedia> 
                            <img src={item.thumbnail} alt={item.title} className="w-24 h-auto object-cover rounded-md" /> 
                        </ItemMedia>
                        <ItemContent> 
                            <ItemTitle>{item.title}</ItemTitle> 
                            <ItemDescription>{item.description}</ItemDescription>
                            <ItemDescription>Php {item.price}</ItemDescription>
                        </ItemContent> 
                        <ItemActions>
                            <ChangeQuantity item={item} quantities={quantities} updateQuantity={updateQuantity} />
                            <Button onClick={() => {
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
        <Button variant="outline" size="icon" aria-label="Subtract" onClick={() => {
                updateQuantity(item.id, (quantities[item.id] || 1) - 1);
        }}>
            <Minus />
        </Button>
        <Input className="w-10 no-arrows" type="number" min="1" value={quantities[item.id] || 1} onChange={(e) => updateQuantity(item.id, e.target.value)}
        />
        <Button variant="outline" size="icon" aria-label="Add" onClick={() => {
                updateQuantity(item.id, (quantities[item.id] || 1) + 1);
        }}>
            <Plus />
        </Button>
    </>);
}
