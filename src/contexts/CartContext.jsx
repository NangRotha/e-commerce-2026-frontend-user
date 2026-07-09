import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  // cart: { id, items: [...], total }
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const loadCart = useCallback(async () => {
    try {
      const response = await cartAPI.get();
      setCart(response.data || { items: [], total: 0 });
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      setCart({ items: [], total: 0 });
    }
  }, [isAuthenticated, loadCart]);

  const cartCount = (cart.items || []).reduce((sum, item) => sum + (item.quantity || 0), 0);

  const addToCart = async (productId, quantity = 1, size = 'M', color = 'Black') => {
    if (!isAuthenticated) {
      toast.error('សូមLoginមុននិងបន្ថែមទំនិញទៅក្នុងកន្ត្រក');
      return false;
    }
    try {
      await cartAPI.add({ product_id: productId, quantity, size, color });
      await loadCart(); // refresh count + dropdown immediately (no page refresh)
      toast.success('បានបន្ថែមទៅកន្ត្រក!');
      return true;
    } catch (error) {
      toast.error('មិនអាចបន្ថែមទៅកន្ត្រកបានទេ');
      return false;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      if (quantity <= 0) {
        await cartAPI.remove(itemId);
      } else {
        await cartAPI.update(itemId, quantity);
      }
      await loadCart();
    } catch (error) {
      toast.error('មិនអាចធ្វើបច្ចុប្បន្នភាពកន្ត្រកបានទេ');
    }
  };

  const removeItem = async (itemId) => {
    try {
      await cartAPI.remove(itemId);
      await loadCart();
    } catch (error) {
      toast.error('មិនអាចលុបទំនិញបានទេ');
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clear();
      await loadCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const value = {
    cart,
    loading,
    cartCount,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    loadCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
