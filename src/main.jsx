import { createRoot } from 'react-dom/client';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { user, signIn, signOut } from './dataaccess/usermanager.js'
import { Login } from '../login.jsx'
import { Home } from './customer/home.jsx'


function App(){
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

createRoot(document.getElementById('root')).render(
  <App />
);