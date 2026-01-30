import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useWishlist } from './WishlistContext';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { isInWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();
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

  // Clear cart when user logs out
  useEffect(() => {
    if (!user) {
      setCartItems([]);
    }
  }, [user]);

  // Save cart to localStorage whenever cartItems change
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      console.log('Cart saved to localStorage:', cartItems);
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  const addToCart = async (product) => {
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
      toast.success(`Updated ${product.name} quantity to ${newQty} in cart!`);
    } else {
      // If qty is not specified, default to 1
      const qty = product.qty || 1;
      setCartItems([...cartItems, { ...product, qty }]);

      // Remove from wishlist if it's wishlisted (silently, no notification)
      if (isInWishlist(product._id)) {
        await removeFromWishlist(product._id, true);
      }
      toast.success(`${product.name} added to cart!`);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(item => item._id !== id));
  };

  const increaseQuantity = (id) => {
    setCartItems(cartItems.map(item =>
      item._id === id ? { ...item, qty: item.qty + 1 } : item
    ));
  };

  const decreaseQuantity = (id) => {
    setCartItems(cartItems.map(item =>
      item._id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item
    ));
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
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    shippingAddress,
    saveShippingAddress,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
