import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
        console.log('Cart loaded from localStorage:', parsedCart);
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        localStorage.removeItem('cartItems');
      }
    }
  }, []);

  // Save cart to localStorage whenever cartItems change
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      console.log('Cart saved to localStorage:', cartItems);
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item._id === product._id);
    if (existingItem) {
      // If qty is specified in the product (from ProductDetails), use it directly
      // Otherwise, increment the existing qty by 1 (from ShopPage)
      const newQty = product.qty !== undefined ? product.qty : existingItem.qty + 1;
      setCartItems(cartItems.map(item =>
        item._id === product._id
          ? { ...item, qty: newQty }
          : item
      ));
    } else {
      // If qty is not specified, default to 1
      setCartItems([...cartItems, { ...product, qty: product.qty || 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(item => item._id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const [shippingAddress, setShippingAddress] = useState({});

  // Load shipping address from localStorage on mount
  useEffect(() => {
    const savedAddress = localStorage.getItem('shippingAddress');
    if (savedAddress) {
      setShippingAddress(JSON.parse(savedAddress));
    }
  }, []);

  // Save shipping address to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
  }, [shippingAddress]);

  const saveShippingAddress = (address) => {
    setShippingAddress(address);
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.qty, 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    shippingAddress,
    saveShippingAddress,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
