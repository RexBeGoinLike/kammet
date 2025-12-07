import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Login } from './login.jsx'
import { Home } from './customer/home.jsx'
import { StoreItemList } from './customer/storeitemlist.jsx';
import { CartProvider } from './customer/cartcontext.jsx';
import './index.css';
import { Car } from 'lucide-react';

function App(){
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/store/:id" element={<StoreItemList key={location.pathname}/>}/>
      </Routes>
    </Router>
  );
}

createRoot(document.getElementById('root')).render(
  <CartProvider>
    <App />
  </CartProvider>
);