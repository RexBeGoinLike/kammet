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
  ItemFooter,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "./../components/ui/item"
import { Button } from "./../components/ui/button";
import { Input } from "./../components/ui/input";
import { Separator} from "./../components/ui/separator";

export function StoreItemList() {
  return <GenerateStoreItemList/>;
}

function GenerateStoreItemList() {

    const [items, setItems] = useState([]);
    const [quantities, setQuantities] = useState({});
    const { id } = useParams();

    const { cart, addToCart, isCartOpen, openCart, closeCart, updateCartQuantity } = useCart();
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
                    </DialogHeader>

                    {(Object.keys(cart).length > 0 ) ? (
                        <>
                            <div className="flex w-full max-w-md flex-col gap-6 max-h-[80vh] overflow-y-auto pr-1"> 
                                {(Object.values(cart).map(cartItem => 
                                    <Item key={cartItem.id} variant="outline"> 
                                        <ItemMedia> 
                                            <img src={cartItem.thumbnail} alt={cartItem.title} className="w-24 h-auto object-cover rounded-md" /> 
                                        </ItemMedia> 
                                        <ItemContent> 
                                            <ItemTitle>{cartItem.title}</ItemTitle> 
                                            <ItemDescription>Php {cartItem.price}</ItemDescription>
                                            <ItemDescription>Subtotal: Php {cartItem.price * cartItem.quantity}</ItemDescription>
                                        </ItemContent>
                                        <ItemActions>
                                            <Button variant="outline" size="icon" aria-label="Subtract" onClick={() => 
                                                updateCartQuantity(cartItem.id, cartItem.quantity - 1) }>
                                                <Minus />
                                            </Button>
                                            <Input className="w-10 no-arrows" type="number" min="1" value={cartItem.quantity} 
                                                onChange={(e) => updateCartQuantity(cartItem.id, e.target.value)}/>
                                            <Button variant="outline" size="icon" aria-label="Add" onClick={() =>
                                                updateCartQuantity(cartItem.id, cartItem.quantity + 1)}>
                                                <Plus />
                                            </Button>
                                        </ItemActions>
                                    </Item>
                                ))}
                                <Separator />
                                <ItemFooter>
                                    Total: Php {(Object.values(cart).reduce((sum, item) => sum + (item.price * item.quantity), 0 ))}
                                </ItemFooter>
                                <Separator />
                            </div>
                            <Button className="mt-2 w-full" onClick={() => navigate(`/checkout/${id}`)}>Checkout</Button>
                        </>
                    ) : ( 
                        <div className="flex flex-col items-center" >
                            <DialogTitle>Your cart is empty.</DialogTitle> 
                            <DialogDescription>Add items to your cart to see them here.</DialogDescription>
                        </div>
                    )}

                </DialogContent>
            </Dialog>

            <div className="flex flex-col gap-4">
                {items.map(item => (
                    <Item key={item.id} variant="outline"> 
                        <ItemMedia> 
                            <img src={item.thumbnail} alt={item.title} className="w-32 h-auto object-cover rounded-md" /> 
                        </ItemMedia>
                        <ItemContent> 
                            <ItemTitle>{item.title}</ItemTitle> 
                            <ItemDescription>{item.description}</ItemDescription>
                            <ItemDescription>Php {item.price}</ItemDescription>
                        </ItemContent> 
                        <ItemActions>
                            <Button variant="outline" size="icon" aria-label="Subtract" onClick={() => {
                                updateQuantity(item.id, (quantities[item.id] || 1) - 1);
                            }}>
                                <Minus />
                            </Button>
                            <Input className="w-10 no-arrows" type="number" min="1" value={quantities[item.id] || 1} onChange={(e) => updateQuantity(item.id, e.target.value)}/>
                            <Button variant="outline" size="icon" aria-label="Add" onClick={() => {
                                    updateQuantity(item.id, (quantities[item.id] || 1) + 1);
                            }}>
                                <Plus />
                            </Button>
                            <Button onClick={() => {
                                addToCart(item, quantities[item.id] || 1);
                                delete quantities[item.id];
                                openCart();
                            }}>Add to Cart</Button>
                        </ItemActions>
                    </Item>
                ))}
            </div>
        </div>
    );
}

