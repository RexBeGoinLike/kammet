import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./../components/ui/card";
import { Button } from "./../components/ui/button";
import { Separator } from "./../components/ui/separator";
import { Badge } from "./../components/ui/badge";
import { 
  Package, 
  CheckCircle, 
  XCircle,
  ArrowRight,
  RefreshCw,
  Bike,
  Clock
} from "lucide-react";

export function CourierDashboard() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  function fetchOrders() {
    fetch('/.netlify/functions/getCourierOrders')
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error("Error fetching orders:", err));
  }

  function updateOrderStatus(orderId, status) {
    fetch('/.netlify/functions/updateOrderStatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: orderId,
        status: status
      }),
    })
      .then(() => fetchOrders())
      .catch(err => console.error("Error updating status:", err));
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Bike className="h-8 w-8 mr-3 text-green-600" />
          <div>
            <h1 className="text-2xl font-bold">Courier Dashboard</h1>
            <p className="text-gray-600">Manage deliveries</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchOrders}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Ready
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(o => o.status === 'Ready').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Bike className="h-5 w-5 mr-2" />
              Out for Delivery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(o => o.status === 'Out for Delivery').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(o => o.status === 'Completed').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Ready for Delivery</h2>
        
        {orders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No orders ready for delivery</div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                      <CardDescription>
                        Customer: {order.userid}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant={
                        order.status === 'Ready' ? 'default' :
                        order.status === 'Out for Delivery' ? 'secondary' :
                        'outline'
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Location:</span>
                      <span className="font-medium">{order.location}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Payment:</span>
                      <span className="font-medium">{order.paymentmethod}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total:</span>
                      <span className="font-bold">Php {order.total}</span>
                    </div>
                    {order.instructions && (
                      <div className="text-sm">
                        <span className="font-medium">Instructions: </span>
                        {order.instructions}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2 justify-end">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/courier/order/${order.id}`)}
                    >
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    
                    {order.status === 'Ready' && (
                      <Button 
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'Out for Delivery')}
                      >
                        <Bike className="h-4 w-4 mr-2" />
                        Pick Up
                      </Button>
                    )}
                    
                    {order.status === 'Out for Delivery' && (
                      <>
                        <Button 
                          size="sm"
                          variant="destructive"
                          onClick={() => updateOrderStatus(order.id, 'Cancelled')}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Failed Delivery
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'Completed')}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Complete Delivery
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}