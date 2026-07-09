import { useState } from 'react';
import { motion } from 'framer-motion'; // Add Framer Motion for animations
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FiUser, FiPhone, FiHome, FiGlobe, FiLock } from 'react-icons/fi';

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
};

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    province: user?.province || '',
  });
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      // Note: You'll need to implement a PUT /users/me endpoint in backend for this
      toast.success('បានធ្វើបច្ចុប្បន្នភាពប្រវត្តិរូបដោយជោគជ័យ!');
    } catch (error) {
      toast.error('មិនអាចធ្វើបច្ចុប្បន្នភាពប្រវត្តិរូបបានទេ');
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    try {
      await authAPI.changePassword(oldPassword, newPassword);
      toast.success('បានប្តូរពាក្យសម្ងាត់ដោយជោគជ័យ!');
      setOldPassword('');
      setNewPassword('');
    } catch (error) {
      toast.error('មិនអាចប្តូរពាក្យសម្ងាត់បានទេ');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#F8F9FA] py-8 px-4 font-khmer"
    >
      <div className="mt-24 container mx-auto max-w-5xl">
        
        {/* Page Title */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <h1 className="text-3xl font-moul text-gray-800 mb-2">ប្រវត្តិរូបរបស់ខ្ញុំ</h1>
          <p className="text-sm text-gray-500">
            គ្រប់គ្រងព័ត៌មានផ្ទាល់ខ្លួន និងសុវត្ថិភាពគណនីរបស់អ្នក។
          </p>
        </motion.div>

        {/* Main Glass Container */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white/80 backdrop-blur-md border border-white/50 rounded-[40px] shadow-[0_8px_32px_rgba(0,0,0,0.06)] p-8 md:p-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* ============ LEFT CARD: PERSONAL INFO ============ */}
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <div className="bg-[#3B82F6]/10 p-3 rounded-full text-[#3B82F6]">
                  <FiUser size={24} />
                </div>
                <h2 className="text-xl font-moul text-gray-800">ព័ត៌មានផ្ទាល់ខ្លួន</h2>
              </div>
              
              <form onSubmit={updateProfile} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ឈ្មោះពេញ</label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      name="full_name" 
                      value={formData.full_name} 
                      onChange={handleChange} 
                      className="w-full pl-12 pr-4 py-3.5 bg-[#F4F6FA] border-none rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all duration-300 placeholder-gray-400 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">លេខទូរស័ព្ទ</label>
                  <div className="relative">
                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      className="w-full pl-12 pr-4 py-3.5 bg-[#F4F6FA] border-none rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all duration-300 placeholder-gray-400 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">អាសយដ្ឋាន</label>
                  <div className="relative">
                    <FiHome className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      name="address" 
                      value={formData.address} 
                      onChange={handleChange} 
                      className="w-full pl-12 pr-4 py-3.5 bg-[#F4F6FA] border-none rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all duration-300 placeholder-gray-400 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ខេត្ត/ក្រុង</label>
                  <div className="relative">
                    <FiGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      name="province" 
                      value={formData.province} 
                      onChange={handleChange} 
                      className="w-full pl-12 pr-4 py-3.5 bg-[#F4F6FA] border-none rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all duration-300 placeholder-gray-400 text-sm"
                    />
                  </div>
                </div>

                <motion.button 
                  type="submit" 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#3B82F6] text-white py-3.5 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg hover:bg-blue-600 transition-all duration-300"
                >
                  ធ្វើបច្ចុប្បន្នភាពប្រវត្តិរូប
                </motion.button>
              </form>
            </motion.div>

            {/* ============ RIGHT CARD: CHANGE PASSWORD ============ */}
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <div className="bg-[#5D1E8A]/10 p-3 rounded-full text-[#5D1E8A]">
                  <FiLock size={24} />
                </div>
                <h2 className="text-xl font-moul text-gray-800">ប្តូរពាក្យសម្ងាត់</h2>
              </div>
              
              <form onSubmit={changePassword} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ពាក្យសម្ងាត់ចាស់</label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="password" 
                      value={oldPassword} 
                      onChange={(e) => setOldPassword(e.target.value)} 
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-[#F4F6FA] border-none rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5D1E8A] transition-all duration-300 placeholder-gray-400 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ពាក្យសម្ងាត់ថ្មី</label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="password" 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)} 
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-[#F4F6FA] border-none rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5D1E8A] transition-all duration-300 placeholder-gray-400 text-sm"
                    />
                  </div>
                </div>

                <motion.button 
                  type="submit" 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#5D1E8A] text-white py-3.5 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg hover:bg-purple-900 transition-all duration-300"
                >
                  ប្តូរពាក្យសម្ងាត់
                </motion.button>
              </form>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Profile;