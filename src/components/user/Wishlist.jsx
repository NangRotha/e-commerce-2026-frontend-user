import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { wishlistAPI, cartAPI } from '../../services/api';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

// =============================================
// HELPER: Fix Backend Image Paths
// =============================================
const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://127.0.0.1:8000';

const getFullImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=200&q=80';

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const response = await wishlistAPI.get();
      setItems(response.data);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id) => {
    try {
      await wishlistAPI.remove(id);
      toast.success('បានលុបចេញពីបញ្ជីចំណូលចិត្ត');
      loadWishlist();
    } catch (error) {
      toast.error('មិនអាចលុបទំនិញបានទេ');
    }
  };

  const addToCart = async (productId) => {
    try {
      await cartAPI.add({ product_id: productId, quantity: 1, size: 'M', color: 'Black' });
      toast.success('បានបន្ថែមទៅកន្ត្រក!');
    } catch (error) {
      toast.error('មិនអាចបន្ថែមទៅកន្ត្រកបានទេ');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#3B82F6] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#FAFAFA] font-khmer py-8 px-4 pb-12"
    >
      <div className="mt-24 container mx-auto max-w-6xl">
        
        {/* Page Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="bg-[#E23D3D]/10 p-3 rounded-full text-[#E23D3D]">
            <FiHeart size={28} />
          </div>
          <h1 className="text-2xl md:text-3xl font-moul text-gray-800">បញ្ជីចំណូលចិត្ត</h1>
        </motion.div>
        
        {items.length === 0 ? (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-20 bg-white rounded-[30px] shadow-sm border border-gray-100"
          >
            <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiHeart className="text-4xl text-gray-300" />
            </div>
            <p className="text-xl text-gray-600 mb-4 font-khmer">បញ្ជីចំណូលចិត្តរបស់អ្នកនៅទទេ</p>
            <Link to="/shop" className="inline-block bg-[#3B82F6] text-white px-8 py-3 rounded-full hover:bg-blue-600 transition shadow-md hover:scale-105 active:scale-95">
              ចាប់ផ្តើមទិញទំនិញ
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {items.map((item) => (
              <motion.div 
                key={item.id} 
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0px 10px 30px rgba(0,0,0,0.08)" }}
                className="bg-white/80 backdrop-blur-md border border-white/50 rounded-[24px] overflow-hidden transition-all duration-300 group shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
              >
                {/* Image */}
                <Link to={`/product/${item.product_id}`} className="block h-48 overflow-hidden relative">
                  {item.image ? (
                    <motion.img 
                      whileHover={{ scale: 1.08 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      src={getFullImageUrl(item.image)} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_IMG;
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-[#F4F6FA] text-gray-400 text-sm">គ្មានរូបភាព</div>
                  )}
                  {/* Heart Icon Badge */}
                  <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm text-[#E23D3D]">
                    <FiHeart className="text-lg fill-[#E23D3D]" />
                  </div>
                </Link>

                {/* Details */}
                <div className="p-5">
                  <Link to={`/product/${item.product_id}`} className="block font-bold text-gray-800 hover:text-[#3B82F6] transition-colors mb-1 truncate text-base">
                    {item.name}
                  </Link>
                  <p className="text-[#3B82F6] font-bold text-lg mb-4">${item.price?.toFixed(2) || '0.00'}</p>
                  
                  {/* Actions */}
                  <div className="flex justify-between items-center gap-2">
                    <motion.button 
                      onClick={() => addToCart(item.product_id)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex-1 bg-[#3B82F6] text-white py-2.5 rounded-xl hover:bg-blue-600 transition flex items-center justify-center gap-2 text-sm font-medium shadow-sm"
                    >
                      <FiShoppingCart className="text-base" /> ទិញ
                    </motion.button>
                    <motion.button 
                      onClick={() => removeItem(item.id)}
                      whileHover={{ scale: 1.1, color: '#EF4444', backgroundColor: '#FEE2E2' }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2.5 text-gray-400 hover:text-red-500 rounded-xl transition-colors"
                      title="Remove from wishlist"
                    >
                      <FiTrash2 className="text-xl" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Wishlist;