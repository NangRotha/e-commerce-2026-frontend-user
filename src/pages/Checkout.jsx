import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartAPI, orderAPI, khqrAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiUser, FiPhone, FiHome, FiGlobe, FiCreditCard, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
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

const Checkout = () => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    customer_name: user?.full_name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    province: user?.province || '',
    // 🚨 removed payment_method - KHQR is now forced
  });

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const response = await cartAPI.get();
      if (response.data.items.length === 0) {
        toast.error('កន្ត្រករបស់អ្នកទទេ');
        navigate('/shop');
        return;
      }
      setCart(response.data);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.items.length === 0) {
      toast.error('កន្ត្រកទទេ');
      return;
    }
    setSubmitting(true);
    try {
      const orderData = {
        ...formData,
        payment_method: 'KHQR', // 🚨 Automatically set to KHQR
        items: cart.items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.product_price,
          size: item.size,
          color: item.color,
        })),
      };
      const order = await orderAPI.create(orderData);
      const orderId = order.data.id;
      toast.success('ការបញ្ជាទិញបានជោគជ័យ!');

      sessionStorage.setItem('last_order_id', orderId);

      const res = await khqrAPI.createRedirect(orderId, cart.total);
      if (res.data && res.data.redirect_url) {
        window.location.href = res.data.redirect_url;
      } else {
        toast.error('មិនអាចទទួលបាន URL ទូទាត់');
      }
    } catch (error) {
      toast.error('មិនអាចដាក់ការបញ្ជាទិញបានទេ');
    } finally {
      setSubmitting(false);
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
      className="min-h-screen bg-[#FAFAFA] font-khmer py-8 px-4 pb-12"
    >
      <div className="mt-24 container mx-auto max-w-6xl">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-8"
        >
          <button onClick={() => navigate('/cart')} className="flex items-center gap-2 text-gray-600 hover:text-[#3B82F6] transition-colors bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md">
            <FiArrowLeft /> ត្រឡប់ក្រោយ
          </button>
          <h1 className="text-2xl md:text-3xl font-moul text-gray-800">បញ្ជាក់ការបញ្ជាទិញ</h1>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col lg:flex-row gap-8">
          {/* LEFT FORM */}
          <motion.div variants={itemVariants} className="flex-1 bg-white/80 backdrop-blur-md border border-white/50 rounded-[30px] shadow-[0_8px_32px_rgba(0,0,0,0.06)] p-6 md:p-10">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
              <div className="bg-[#3B82F6]/10 p-3 rounded-full text-[#3B82F6]"><FiUser size={24} /></div>
              <h2 className="text-xl font-moul text-gray-800">ព័ត៌មានដឹកជញ្ជូន</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ឈ្មោះពេញ *</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" name="customer_name" required value={formData.customer_name} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-[#F4F6FA] border-none rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all duration-300 placeholder-gray-400 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">លេខទូរស័ព្ទ *</label>
                <div className="relative">
                  <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" name="phone" required value={formData.phone} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-[#F4F6FA] border-none rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all duration-300 placeholder-gray-400 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">អាសយដ្ឋាន *</label>
                <div className="relative">
                  <FiHome className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" name="address" required value={formData.address} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-[#F4F6FA] border-none rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all duration-300 placeholder-gray-400 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ខេត្ត/ក្រុង *</label>
                <div className="relative">
                  <FiGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" name="province" required value={formData.province} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-[#F4F6FA] border-none rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all duration-300 placeholder-gray-400 text-sm" />
                </div>
              </div>
              
              {/* 🚨 KHQR Label (No Select Dropdown) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">វិធីទូទាត់</label>
                <div className="w-full pl-12 pr-4 py-3.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-sm flex items-center">
                  <FiCreditCard className="absolute left-4 text-blue-500" />
                  <span className="pl-8">KHQR / Bakong (Auto Payment)</span>
                </div>
              </div>

              <motion.button type="submit" disabled={submitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full bg-[#3B82F6] text-white py-4 rounded-xl font-semibold text-base shadow-md hover:shadow-lg hover:bg-blue-600 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70">
                {submitting ? (
                  <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> កំពុងដាក់ការបញ្ជាទិញ...</>
                ) : (
                  <><FiCheckCircle /> បញ្ជាក់ការបញ្ជាទិញ (${cart.total.toFixed(2)})</>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* RIGHT SUMMARY */}
          <motion.div variants={itemVariants} className="w-full lg:w-80 bg-white rounded-[30px] shadow-[0_8px_32px_rgba(0,0,0,0.06)] p-6 md:p-8 h-fit border border-gray-100">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
              <div className="bg-[#F59E0B]/10 p-3 rounded-full text-[#F59E0B]"><FiCheckCircle size={24} /></div>
              <h2 className="text-xl font-moul text-gray-800">សេចក្តីសង្ខេប</h2>
            </div>
            <div className="space-y-4">
              {cart.items.map((item, index) => (
                <motion.div key={item.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="flex justify-between text-sm text-gray-600 pb-2 border-b border-gray-50/80">
                  <span className="truncate max-w-[120px]">{item.product_name} <span className="text-xs text-gray-400">x{item.quantity}</span></span>
                  <span className="font-medium text-gray-800">${item.subtotal.toFixed(2)}</span>
                </motion.div>
              ))}
            </div>
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between text-sm text-gray-600 py-1"><span>ទំនិញ</span><span>${cart.total.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm text-gray-600 py-1"><span>ថ្លៃដឹកជញ្ជូន</span><span>ឥតគិតថ្លៃ</span></div>
              <div className="flex justify-between font-bold text-lg text-gray-800 mt-3 pt-3 border-t border-gray-200">
                <span>សរុប</span>
                <span>${cart.total.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Checkout;