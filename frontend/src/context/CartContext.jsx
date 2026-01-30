import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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
  const [loading, setLoading] = useState(false);
  const previousUserRef = useRef();

  // Load cart from localStorage on mount (for guest users)
  useEffect(() => {
    if (!user) {
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
    }
  }, [user]);

  // Load cart from backend when user logs in, sync on logout
  useEffect(() => {
    const handleUserChange = async () => {
      if (user) {
        // Load guest cart from localStorage
        const savedCart = localStorage.getItem('cartItems');
        let guestCart = [];
        if (savedCart) {
          try {
            guestCart = JSON.parse(savedCart);
          } catch (error) {
            console.error('Error parsing guest cart:', error);
            localStorage.removeItem('cartItems');
          }
        }

        // Load backend cart
        const backendCart = await loadCartFromBackend();

        // Merge guest cart with backend cart
        const mergedCart = [...backendCart];
        for (const guestItem of guestCart) {
          const existing = mergedCart.find(item => item._id === guestItem._id);
          if (existing) {
            existing.qty += guestItem.qty;
          } else {
            mergedCart.push(guestItem);
          }
        }

        setCartItems(mergedCart);

        // Clear guest cart from localStorage after merging
        localStorage.removeItem('cartItems');
      } else {
        // If user was logged in, sync cart to backend before clearing
        if (previousUserRef.current) {
          await syncCartToBackend(cartItems);
        }
        // Clear cart on logout
        setCartItems([]);
      }
    };

    handleUserChange();
    previousUserRef.current = user;
  }, [user]);

  const loadCartFromBackend = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const cartData = await response.json();
        // Transform backend cart format to frontend format, only include populated products
        const transformedCart = cartData
          .filter(item => item.product && typeof item.product === 'object' && item.product._id)
          .map(item => ({
            ...item.product,
            qty: item.qty,
          }));
        console.log('Cart loaded from backend:', transformedCart);
        return transformedCart;
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error loading cart from backend:', error);
      return [];
    }
  };

  const syncCartToBackend = async (items) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      // Clear existing cart
      await fetch('http://localhost:5000/api/cart', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Add all items
      for (const item of items) {
        await fetch('http://localhost:5000/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: item._id, qty: item.qty }),
        });
      }
    } catch (error) {
      console.error('Error syncing cart to backend:', error);
    }
  };

  // Save cart to localStorage whenever cartItems change
  useEffect(() => {
    try {
      // Save to localStorage if user is logged in or cart has items
      if (user || cartItems.length > 0) {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        console.log('Cart saved to localStorage:', cartItems);
      }
      // Sync to backend if user is logged in
      if (user) {
        syncCartToBackend(cartItems);
      }
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems, user]);

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
