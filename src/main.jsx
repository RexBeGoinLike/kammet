import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, useNavigate, BrowserRouter } from 'react-router-dom';
import { Login } from './login.jsx'
import { Home } from './customer/home.jsx'
import { StoreItemList } from './customer/storeitemlist.jsx';
import { Checkout } from './customer/checkout.jsx';
import { StaffDashboard } from './canteenstaff/staffdashboard.jsx';
import { StaffOrderDetail } from './canteenstaff/stafforderdetail.jsx';
import { CourierDashboard } from './courier/courierdashboard.jsx';
import { CourierOrderDetail } from './courier/courierorderdetail.jsx';
import { CartProvider } from './customer/cartcontext.jsx';
import './index.css';

function App(){
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/store/:id" element={<StoreItemList key={location.pathname}/>}/>
        <Route path="/checkout/:id" element={<Checkout />} />
        <Route path="/staffdashboard" element={<StaffDashboard />} />
        <Route path="/staff/order/:id" element={<StaffOrderDetail />} />
        <Route path="/courierdashboard" element={<CourierDashboard />} />
        <Route path="/courier/order/:id" element={<CourierOrderDetail />} />
      </Routes>
    </Router>
  );
}

createRoot(document.getElementById('root')).render(
  <CartProvider>
      <App className="container" />
  </CartProvider>
);