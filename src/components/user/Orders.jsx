import { useState, useEffect } from 'react';
import { orderAPI } from '../../services/api';
import { Link } from 'react-router-dom';
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

// Helper function to find image URL from complex objects
const getItemImage = (item) => {
  if (item.product_image) return item.product_image;
  if (item.image_url) return item.image_url;
  if (item.product && item.product.image_url) return item.product.image_url;
  if (item.product && item.product.images && item.product.images.length > 0) {
    return item.product.images[0].image_url;
  }
  if (item.images && item.images.length > 0) {
    return item.images[0].image_url;
  }
  return null;
};

// =============================================
// ANIMATION VARIANTS
// =============================================
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // បង្ហាញកាតនីមួយៗដោយមានគម្លាត 0.1s
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await orderAPI.getAll();
      const data = response.data || response;
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

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
      className="bg-[#FAFAFA] min-h-screen font-khmer pb-12 pt-8"
    >
      <div className="mt-24 container mx-auto px-4 max-w-5xl">
        
        {/* Page Header Animation */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-moul text-gray-800 mb-2">ប្រវត្តិការបញ្ជាទិញ</h1>
          <p className="text-sm text-gray-500">
            តាមដានស្ថានភាពនៃការបញ្ជាទិញថ្មីៗរបស់អ្នក គ្រប់គ្រងការត្រឡប់ទំនិញយ៉ាងងាយស្រួល។
          </p>
        </motion.div>

        {orders.length === 0 ? (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100"
          >
            <p className="text-xl text-gray-600 mb-6 font-khmer">អ្នកមិនទាន់បានបញ្ជាទិញអ្វីនៅឡើយទេ។</p>
            <Link to="/shop" className="bg-[#3B82F6] text-white px-8 py-3 rounded-full hover:bg-blue-600 transition shadow-md font-medium inline-block hover:scale-105 active:scale-95 transition-all duration-300">
              ចាប់ផ្តើមទិញទំនិញ
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {orders.map((order, index) => {
              const calculatedTotal = order.items?.reduce((total, item) => {
                const price = item.price || item.unit_price || 0;
                const qty = item.quantity || item.qty || 0;
                return total + (price * qty);
              }, 0) || order.total_price || 0;

              const formattedDate = new Date(order.created_at || order.date || Date.now())
                .toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

              return (
                <motion.div 
                  key={order.id} 
                  variants={itemVariants}
                  whileHover={{ y: -3, boxShadow: "0px 10px 30px rgba(0,0,0,0.08)" }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 transition-all duration-300"
                >
                  {/* 1. ORDER HEADER ROW */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-6"
                  >
                    <div className="flex items-center gap-6 md:gap-10">
                      <div>
                        <p className="text-[11px] text-gray-400 uppercase tracking-wider">លេខបញ្ជាទិញ</p>
                        <p className="font-bold text-gray-800 text-base">#{order.id}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-gray-400 uppercase tracking-wider">កាលបរិច្ឆេទ</p>
                        <p className="text-gray-700 text-sm font-medium">{formattedDate}</p>
                      </div>
                    </div>
                    <div className="hidden md:block">
                      <p className="text-[11px] text-gray-400 uppercase tracking-wider">វិធីទូទាត់</p>
                      <p className="text-gray-700 text-sm font-medium">
                        {order.payment_method || 'Cash on Delivery'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-auto">
                      <Link to={`/orders/${order.id}`} className="px-6 py-2 border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition hover:scale-105 active:scale-95">
                        មើលការបញ្ជាទិញ
                      </Link>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-2 bg-[#5D1E8A] text-white rounded-full text-sm font-medium hover:bg-purple-900 transition shadow-md"
                      >
                        មើលវិក្កយបត្រ
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* 2. ORDER ITEMS LIST */}
                  <div className="space-y-6">
                    {order.items?.map((item, itemIndex) => {
                      const itemPrice = item.price || item.unit_price || 0;
                      const itemQty = item.quantity || item.qty || 1;
                      const itemTotal = itemPrice * itemQty;
                      const imgUrl = getItemImage(item);
                      
                      return (
                        <motion.div 
                          key={item.id || itemIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + (itemIndex * 0.05) }}
                          className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 pb-6 border-b border-gray-50 last:border-0 last:pb-0"
                        >
                          {/* Product Image */}
                          <div className="w-24 h-24 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden border border-gray-200">
                            <motion.img 
                              whileHover={{ scale: 1.1 }}
                              transition={{ type: "spring", stiffness: 300 }}
                              src={getFullImageUrl(imgUrl)} 
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=200&q=80";
                              }}
                              alt={item.product_name || "Product"} 
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-gray-800">
                              {item.product_name || item.name || `ផលិតផល #${item.product_id}`}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                              {item.description || item.variant || 'ទំនិញទូទៅ'}
                            </p>
                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                              <p>ចំនួន: <span className="font-medium">{itemQty}</span></p>
                              <p>លេខបញ្ជាទិញ: <span className="font-medium text-gray-800">#{order.id}</span></p>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="md:ml-auto text-left md:text-right mt-2 md:mt-0">
                            <p className="font-bold text-lg text-gray-800">
                              ${itemTotal.toFixed(2)}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* 3. ORDER FOOTER */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 pt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-t border-gray-100"
                  >
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <motion.div 
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className={`w-3 h-3 rounded-full flex-shrink-0 ${order.status === 'delivered' || order.status === 'Delivered' ? 'bg-green-500' : 'bg-red-500'}`}
                        ></motion.div>
                        <span className="text-xs text-gray-600">
                          {order.status === 'delivered' || order.status === 'Delivered' ? 'បានបញ្ជូនដោយជោគជ័យ' : 'មិនទាន់បានបញ្ជូន'} នៅថ្ងៃទី {formattedDate}
                        </span>
                      </div>
                      <div className="md:hidden font-bold text-gray-800 w-full text-left mt-1">
                        សរុប៖ ${calculatedTotal.toFixed(2)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between w-full md:w-auto gap-4 text-xs font-medium text-gray-800">
                      <div className="hidden md:block font-bold text-gray-800 mr-6">
                        សរុប៖ ${calculatedTotal.toFixed(2)}
                      </div>
                      <Link to={`/product/${order.items?.[0]?.product_id || ''}`} className="hover:text-[#3B82F6] transition hover:scale-105 active:scale-95">
                        មើលផលិតផល
                      </Link>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="hover:text-[#3B82F6] transition"
                      >
                        ទិញម្តងទៀត
                      </motion.button>
                    </div>
                  </motion.div>

                </motion.div>
              );
            })}
          </motion.div>
        )}

      </div>
    </motion.div>
  );
};

export default Orders;