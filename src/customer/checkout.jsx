import { useCart } from "./cartcontext";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "./../components/ui/field"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./../components/ui/card"
import { Button } from "./../components/ui/button";
import { Separator } from "./../components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./../components/ui/select";
import { Input } from "./../components/ui/input";
import { Textarea } from "./../components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth } from "./../dataaccess/firebase.js";


export function Checkout() {
    const { cart, clearCart } = useCart();
    const { id } = useParams();
    
    const [ location, setLocation ] = useState("");
    const [ instructions, setInstructions ] = useState("");
    const [ method, setMethod ] = useState("Cash on Delivery");

    const navigate = useNavigate();

    async function sendCart() {
        try {
            const response = await fetch("/.netlify/functions/addOrder", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    items: Object.values(cart),
                    instructions: instructions,
                    location: location,
                    method: method,   
                    storeid: id,    
                    userid: auth.currentUser.uid,
                }),
            });
            
            navigate("/home");
            const data = await response.json();
            console.log("Server response:", data);
            clearCart();
        } catch (err) {
            console.error("Error sending cart:", err);
        }
    }

    return (
        <div className="flex justify-center p-4">
            <Card className="w-lg">
                <CardHeader>
                    <Button variant="none" className="p-0 flex justify-start" size="icon" onClick={() => navigate(`/store/${id}`)}>
                        <ArrowLeft />
                    </Button>
                    <CardTitle>Checkout</CardTitle>
                    <CardDescription>Review your order before proceeding to payment.</CardDescription>
                </CardHeader>
                <CardContent>
                    <CardDescription>Order Summary</CardDescription>
                    <div className="flex flex-col gap-2 mt-2 mb-2">
                        {Object.values(cart).map((cartItem) => (
                            <p key={cartItem.id} className="flex justify-between text-sm">
                                <span>{cartItem.title} x {cartItem.quantity}</span>
                                <span>Php {cartItem.price * cartItem.quantity}</span>
                            </p>
                        ))}
                    </div>
                    <Separator />
                    <p className="flex justify-between text-sm mt-2 mb-14">
                        <span>Total:</span> 
                        <span>Php {Object.values(cart).reduce((sum, item) => sum + item.price * item.quantity, 0)}</span>
                    </p>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        sendCart();
                    }}>
                        <FieldSet>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="payment-method">
                                        Payment Method
                                    </FieldLabel>
                                    <Select onValueChange={setMethod} className="text-sm" defaultValue="Cash on Delivery">
                                        <SelectTrigger id="payment-method" className="w-full">
                                            <SelectValue placeholder="Cash on Delivery" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Cash on Delivery">Cash on Delivery</SelectItem>
                                            <SelectItem value="Online Payment">Online Payment</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="location">Delivery Location *</FieldLabel>
                                    <Input className="text-sm" id="location" type="text" placeholder="Enter a Landmark/Room Number" 
                                    onChange={(e) => setLocation(e.target.value)} />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="instructions">Special Instructions</FieldLabel>
                                    <Textarea className="text-sm" id="instructions" placeholder="Enter Special Requests" rows={5}
                                    onChange={(e) => setInstructions(e.target.value)}/>
                                    
                                </Field>
                            </FieldGroup>
                        </FieldSet>
                        <Field>
                            <Button type="submit" className="mt-4 w-full">
                                Checkout
                            </Button>
                        </Field>
                    </form>
                </CardContent>
            
            </Card>
        </div>
    );
}