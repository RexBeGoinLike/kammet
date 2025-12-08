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
  Clock,
  ArrowRight,
  RefreshCw,
  XCircle,
  CheckCheck
} from "lucide-react";

export function StaffDashboard() {
  const [orders, setOrders] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [showHistory]);

  function fetchOrders() {
    const endpoint = showHistory 
      ? '/.netlify/functions/getAllStaffOrders'
      : '/.netlify/functions/getStaffOrders';
    
    fetch(endpoint)
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error("Error fetching orders:", err));
  }

  function cancelOrder(orderId) {
    const confirmCancel = window.confirm("Cancel this order? This cannot be undone.");
    if (!confirmCancel) return;

    fetch('/.netlify/functions/cancelOrderStaff', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: orderId
      }),
    })
      .then(() => {
        alert("Order cancelled");
        fetchOrders();
      })
      .catch(err => console.error("Error cancelling order:", err));
  }

  const activeOrders = orders.filter(o => !showHistory || (o.status !== 'Completed' && o.status !== 'Cancelled'));
  const completedOrders = orders.filter(o => showHistory && (o.status === 'Completed' || o.status === 'Cancelled'));

  return (
    <div className="p-4">
      <div className="flex flex-col justify-start items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Staff Dashboard</h1>
          <p className="text-gray-600 mb-4">Manage and prepare orders</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={showHistory ? "outline" : "default"}
            size="sm"
            onClick={() => setShowHistory(false)}
          >
            Active Orders
          </Button>
          <Button 
            variant={showHistory ? "default" : "outline"}
            size="sm"
            onClick={() => setShowHistory(true)}
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            History
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchOrders}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {!showHistory ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Pending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {orders.filter(o => o.status === 'Pending').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Preparing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {orders.filter(o => o.status === 'Preparing').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Ready
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {orders.filter(o => o.status === 'Ready').length}
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <h2 className="text-xl font-bold">Active Orders</h2>
            
            {orders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No active orders</div>
            ) : (
              <div className="space-y-4">
                {activeOrders.map((order) => (
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
                            order.status === 'Pending' ? 'secondary' :
                            order.status === 'Preparing' ? 'default' :
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
                          onClick={() => navigate(`/staff/order/${order.id}`)}
                        >
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        
                        {order.status === 'Pending' && (
                          <Button 
                            size="sm"
                            onClick={() => cancelOrder(order.id)}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel Order
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <Separator className="my-6" />
          
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Order History</h2>
            
            {completedOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No order history</div>
            ) : (
              <div className="space-y-4">
                {completedOrders.map((order) => (
                  <Card key={order.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                          <CardDescription>
                            Customer: {order.userid} • {new Date(order.created_at).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge 
                          variant={
                            order.status === 'Completed' ? 'outline' :
                            'destructive'
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
                      
                      <div className="mt-4 flex justify-end">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/staff/order/${order.id}`)}
                        >
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}