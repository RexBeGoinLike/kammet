import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (item, quantity) => {
    setCart(prev => ({
      ...prev,
      [item.id]: { ...item, quantity: (prev[item.id]?.quantity || 0) + quantity }
    }));
  };

  const updateCartQuantity = (id, value) => {
    setCart(prevCart => {
      const newCart = { ...prevCart };

      if (value < 1) {
        delete newCart[id];
      } else {
        newCart[id] = { ...newCart[id], quantity: value }; 
      }

      return newCart;
    });
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider value={{ cart, addToCart, isCartOpen, openCart, closeCart, updateCartQuantity }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
