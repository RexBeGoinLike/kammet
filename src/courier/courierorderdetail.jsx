import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "./../components/ui/card";
import { Button } from "./../components/ui/button";
import { Separator } from "./../components/ui/separator";
import { Badge } from "./../components/ui/badge";
import { ArrowLeft, Bike, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export function CourierOrderDetail() {
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrder();
  }, [id]);

  function fetchOrder() {
    fetch(`/.netlify/functions/getOrderDetail?id=${id}`)
      .then(res => res.json())
      .then(data => {
        setOrder(data.order);
        setOrderItems(data.items);
      })
      .catch(err => console.error("Error fetching order:", err));
  }

  function updateStatus(newStatus) {
    fetch('/.netlify/functions/updateOrderStatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: id,
        status: newStatus
      }),
    })
      .then(() => {
        fetchOrder();
        if (newStatus === 'Completed' || newStatus === 'Cancelled') {
          navigate('/courierdashboard');
        }
      })
      .catch(err => console.error("Error updating status:", err));
  }

  if (!order) {
    return (
      <div className="p-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Order not found</h3>
              <p className="text-gray-600">The requested order could not be found.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={() => navigate('/courierdashboard')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Order #{order.id}</CardTitle>
              <CardDescription>
                Customer ID: {order.userid}
              </CardDescription>
            </div>
            <Badge 
              variant={
                order.status === 'Ready' ? 'default' :
                order.status === 'Out for Delivery' ? 'secondary' :
                order.status === 'Completed' ? 'outline' :
                'destructive'
              }
              className="text-lg"
            >
              {order.status}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Delivery Information</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Location:</span>
                  <span className="font-medium">{order.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium">{order.paymentmethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-bold">Php {order.total}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Order Details</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span>#{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Store ID:</span>
                  <span>{order.storeid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Time:</span>
                  <span>{new Date(order.created_at).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {order.instructions && (
            <div>
              <h4 className="font-semibold mb-2">Special Instructions</h4>
              <Card className="bg-gray-50">
                <CardContent className="pt-4">
                  <p className="text-sm">{order.instructions}</p>
                </CardContent>
              </Card>
            </div>
          )}

          <Separator />

          <div>
            <h4 className="font-semibold mb-2">Order Items</h4>
            <div className="space-y-2">
              {orderItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium">{item.itemname}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-medium">Php {item.subtotal}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Separator />
          
          <div className="flex flex-col justify-between items-center w-full">
            <div>
              <h4 className="font-bold text-lg">Total: Php {order.total}</h4>
            </div>
            
            <div className="flex space-x-2">
              {order.status === 'Ready' && (
                <Button 
                  onClick={() => updateStatus('Out for Delivery')}
                >
                  <Bike className="h-4 w-4 mr-2" />
                  Pick Up Order
                </Button>
              )}
              
              {order.status === 'Out for Delivery' && (
                <>
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      if (window.confirm("Mark this delivery as failed? This will cancel the order.")) {
                        updateStatus('Cancelled');
                      }
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Failed Delivery
                  </Button>
                  <Button 
                    onClick={() => {
                      if (window.confirm("Mark this delivery as completed?")) {
                        updateStatus('Completed');
                      }
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Delivery
                  </Button>
                </>
              )}
              
              {(order.status === 'Completed' || order.status === 'Cancelled') && (
                <Button 
                  variant="outline"
                  disabled
                >
                  {order.status === 'Completed' ? 'Delivery Completed' : 'Delivery Failed'}
                </Button>
              )}
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}