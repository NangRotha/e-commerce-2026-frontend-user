import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cartAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { FiTrash2, FiShoppingCart, FiArrowRight, FiPlus, FiMinus } from 'react-icons/fi';
import { motion } from 'framer-motion';

// Must match the backend address (same as api.js)
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
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
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

const CartPage = () => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadCart = async () => {
    try {
      const response = await cartAPI.get();
      setCart(response.data);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      await cartAPI.update(itemId, newQuantity);
      loadCart();
    } catch (error) {
      toast.error('មិនអាចធ្វើបច្ចុប្បន្នភាពកន្ត្រកបានទេ');
    }
  };

  const removeItem = async (itemId) => {
    try {
      await cartAPI.remove(itemId);
      toast.success('បានលុបទំនិញចេញ');
      loadCart();
    } catch (error) {
      toast.error('មិនអាចលុបទំនិញចេញបានទេ');
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clear();
      toast.success('បានសម្អាតកន្ត្រក');
      loadCart();
    } catch (error) {
      toast.error('មិនអាចសម្អាតកន្ត្រកបានទេ');
    }
  };

  if (!isAuthenticated) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-[60vh] flex flex-col items-center justify-center text-center py-20 bg-white rounded-[30px] shadow-sm border border-gray-100 mx-auto max-w-2xl px-6"
      >
        <FiShoppingCart className="text-6xl text-gray-300 mb-4" />
        <p className="text-xl text-gray-600 mb-4 font-khmer">សូម <Link to="/login" className="text-[#3B82F6] font-semibold hover:underline">ចូលប្រើប្រាស់</Link> ដើម្បីមើលកន្ត្រករបស់អ្នក។</p>
      </motion.div>
    );
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-12 h-12 border-4 border-[#3B82F6] border-t-transparent rounded-full"
      />
    </div>
  );

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
          <div className="bg-[#3B82F6]/10 p-3 rounded-full text-[#3B82F6]">
            <FiShoppingCart size={28} />
          </div>
          <h1 className="text-2xl md:text-3xl font-moul text-gray-800">កន្ត្រកទំនិញ</h1>
        </motion.div>

        {cart.items.length === 0 ? (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-20 bg-white rounded-[30px] shadow-sm border border-gray-100"
          >
            <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiShoppingCart className="text-4xl text-gray-300" />
            </div>
            <p className="text-xl text-gray-600 mb-4 font-khmer">កន្ត្រករបស់អ្នកទទេ</p>
            <Link to="/shop" className="inline-block bg-[#3B82F6] text-white px-8 py-3 rounded-full hover:bg-blue-600 transition shadow-md hover:scale-105 active:scale-95">
              បន្តទិញទំនិញ
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* ========== LEFT SIDE: CART ITEMS ========== */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex-1 bg-white/80 backdrop-blur-md border border-white/50 rounded-[30px] shadow-[0_8px_32px_rgba(0,0,0,0.06)] overflow-hidden"
            >
              {cart.items.map((item) => (
                <motion.div 
                  key={item.id} 
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row items-start sm:items-center p-6 border-b border-gray-100 last:border-0 gap-4"
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-[#F4F6FA] rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
                    {item.product_image ? (
                      <img
                        src={getFullImageUrl(item.product_image)}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = FALLBACK_IMG;
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400 text-xs">គ្មានរូបភាព</div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <Link to={`/product/${item.product_id}`} className="font-bold text-gray-800 hover:text-[#3B82F6] transition-colors text-base line-clamp-1">
                      {item.product_name}
                    </Link>
                    <div className="text-sm text-gray-500 mt-1">
                      ទំហំ: {item.size} | ពណ៌: {item.color}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      តម្លៃឯកតា: <span className="font-medium text-gray-800">${item.product_price.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center bg-[#F4F6FA] rounded-full border border-gray-200">
                    <button 
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity-1))} 
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-l-full transition hover:text-[#3B82F6]"
                    >
                      <FiMinus size={14} />
                    </button>
                    <span className="w-10 text-center font-medium text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity+1)} 
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-r-full transition hover:text-[#3B82F6]"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>

                  {/* Price & Delete Button */}
                  <div className="flex items-center gap-6 ml-auto">
                    <div className="text-right">
                      <div className="font-bold text-[#3B82F6] text-base">${item.subtotal.toFixed(2)}</div>
                    </div>
                    <motion.button 
                      onClick={() => removeItem(item.id)} 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                    >
                      <FiTrash2 className="text-lg" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* ========== RIGHT SIDE: ORDER SUMMARY ========== */}
            <motion.div 
              variants={itemVariants}
              className="w-full lg:w-80 bg-white rounded-[30px] shadow-[0_8px_32px_rgba(0,0,0,0.06)] p-6 md:p-8 h-fit border border-gray-100"
            >
              <h2 className="text-xl font-moul text-gray-800 mb-6 border-b border-gray-100 pb-4">សេចក្តីសង្ខេប</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>ថ្លៃទំនិញ</span>
                  <span className="font-medium text-gray-800">${cart.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>ថ្លៃដឹកជញ្ជូន</span>
                  <span className="text-green-500 font-medium">ឥតគិតថ្លៃ</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between font-bold text-lg text-gray-800">
                  <span>សរុប</span>
                  <span className="text-[#3B82F6]">${cart.total.toFixed(2)}</span>
                </div>
              </div>

              <Link to="/checkout" className="block w-full bg-[#3B82F6] text-white text-center py-3.5 rounded-xl font-semibold shadow-md hover:shadow-lg hover:bg-blue-600 transition-all duration-300 mt-6 hover:scale-[1.02] active:scale-95">
                បញ្ជាក់ការទិញ
              </Link>
              <button 
                onClick={clearCart} 
                className="block w-full text-center py-2 text-red-500 hover:text-red-700 transition mt-3 text-sm hover:bg-red-50 rounded-xl"
              >
                សម្អាតកន្ត្រក
              </button>
            </motion.div>

          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CartPage;