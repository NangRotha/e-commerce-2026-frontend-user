import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistAPI } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  // items: [{ id (wishlist id), product_id, name, price, image }]
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const loadWishlist = useCallback(async () => {
    try {
      const response = await wishlistAPI.get();
      setItems(response.data || []);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadWishlist();
    } else {
      setItems([]);
    }
  }, [isAuthenticated, loadWishlist]);

  const isWishlisted = useCallback(
    (productId) => items.some((item) => item.product_id === productId),
    [items]
  );

  const wishlistCount = items.length;

  const toggleWishlist = async (productId) => {
    if (!isAuthenticated) {
      toast.error('សូមចូលប្រើប្រាស់ដើម្បីរក្សាទុកផលិតផល');
      return;
    }
    const existing = items.find((item) => item.product_id === productId);
    try {
      if (existing) {
        await wishlistAPI.remove(existing.id);
        setItems((prev) => prev.filter((item) => item.id !== existing.id));
        toast.success('បានលុបចេញពីបញ្ជីចំណូលចិត្ត');
      } else {
        await wishlistAPI.add({ product_id: productId });
        await loadWishlist();
        toast.success('បានរក្សាទុកក្នបងចំណូលចិត្ត');
      }
    } catch (error) {
      toast.error('មិនអាចធ្វើប្រតិបត្តកម្មបានទេ');
    }
  };

  const value = {
    items,
    loading,
    isWishlisted,
    wishlistCount,
    toggleWishlist,
    loadWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
