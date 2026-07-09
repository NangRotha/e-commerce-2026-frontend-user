import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FiUser, FiMail, FiLock, FiPhone, 
  FiHome, FiGlobe, FiEye, FiEyeOff 
} from 'react-icons/fi';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    phone: '',
    address: '',
    province: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await register(formData);
    if (result.success) {
      navigate('/login');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#EBEDFF] via-[#F4F5FF] to-[#FFFFFF] flex items-center justify-center p-6 relative font-sans overflow-hidden">
      
      {/* Main Big White Container Card */}
      <div className="mt-24 relative w-full max-w-5xl bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 md:p-12 flex flex-col lg:flex-row gap-12 overflow-hidden animate-fadeInUp">
        
        {/* ========== LEFT SIDE: CONTENT & FULL ILLUSTRATION ========== */}
        <div className="w-full lg:w-[45%] flex flex-col justify-start relative z-10 pt-4">
          
          {/* 1. Logo */}
          <div className="mb-8">
            <div className="text-3xl font-bold text-[#1A237E] tracking-tight">MarketPlace</div>
          </div>

          {/* 2. Welcome Text */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-[#3B82F6] mb-4 leading-[1.2]">
              ចូលរួមជាមួយ <br /> សហគមន៍របស់យើង
            </h1>
            <p className="text-gray-500 text-base leading-relaxed max-w-sm">
              បង្កើតគណនីរបស់អ្នកដើម្បីស្វែងរកទំនិញពិសេសៗ និងទទួលបានការគាំទ្រពីសហគមន៍។
            </p>
          </div>

          {/* 3. FULL ILLUSTRATION (No Beige Box, Floating freely) */}
          <div className="w-full flex-1 flex items-center justify-center relative mt-4 ">
            <img 
              src="https://i.pinimg.com/originals/a3/98/59/a39859d44ad68f19326456c71900eaf6.gif" 
              alt="Woman creating account" 
              className="w-full max-h-[350px] lg:max-h-[400px] object-contain  "
            />
          </div>
        </div>

        {/* ========== RIGHT SIDE: REGISTER FORM ========== */}
        <div className="w-full lg:w-[55%] flex items-start justify-center lg:justify-end">
          <div className={`w-full max-w-lg bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] p-8 md:p-10 transition-all duration-300 animate-fadeInRight`}>
            
            {/* Form Header */}
            <div className="flex justify-start gap-8 mb-6 border-b border-gray-100 pb-4">
              <Link to="/login" className="text-gray-400 hover:text-gray-600 transition pb-4 font-medium text-base -mb-4">ចូលប្រើ</Link>
              <Link to="/register" className="text-[#3B82F6] border-b-2 border-[#3B82F6] pb-4 font-medium text-base -mb-4">បង្កើតគណនី</Link>
            </div>

            {/* Form Container (Scrollable) */}
            <div className="max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Row: Username & Full Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">ឈ្មោះអ្នកប្រើ *</label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        name="username" 
                        required
                        className="w-full pl-10 pr-4 py-3 bg-[#F3F4F6] rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:bg-white transition-all duration-300 placeholder-gray-400 text-sm"
                        value={formData.username} onChange={handleChange} 
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">ឈ្មោះពេញ</label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        name="full_name"
                        className="w-full pl-10 pr-4 py-3 bg-[#F3F4F6] rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:bg-white transition-all duration-300 placeholder-gray-400 text-sm"
                        value={formData.full_name} onChange={handleChange} 
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">អ៊ីមែល *</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="email" 
                      name="email" 
                      required
                      className="w-full pl-10 pr-4 py-3 bg-[#F3F4F6] rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:bg-white transition-all duration-300 placeholder-gray-400 text-sm"
                      value={formData.email} onChange={handleChange} 
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">ពាក្យសម្ងាត់ *</label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      name="password" 
                      required
                      className="w-full pl-10 pr-12 py-3 bg-[#F3F4F6] rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:bg-white transition-all duration-300 placeholder-gray-400 text-sm"
                      value={formData.password} onChange={handleChange} 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3B82F6] transition-colors duration-300"
                    >
                      {showPassword ? <FiEye /> : <FiEyeOff />}
                    </button>
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">លេខទូរស័ព្ទ</label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      name="phone"
                      className="w-full pl-10 pr-4 py-3 bg-[#F3F4F6] rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:bg-white transition-all duration-300 placeholder-gray-400 text-sm"
                      value={formData.phone} onChange={handleChange} 
                    />
                  </div>
                </div>

                {/* Address & Province Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">អាសយដ្ឋាន</label>
                    <div className="relative">
                      <FiHome className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        name="address"
                        className="w-full pl-10 pr-4 py-3 bg-[#F3F4F6] rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:bg-white transition-all duration-300 placeholder-gray-400 text-sm"
                        value={formData.address} onChange={handleChange} 
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">ខេត្ត/ក្រុង</label>
                    <div className="relative">
                      <FiGlobe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        name="province"
                        className="w-full pl-10 pr-4 py-3 bg-[#F3F4F6] rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:bg-white transition-all duration-300 placeholder-gray-400 text-sm"
                        value={formData.province} onChange={handleChange} 
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-[#3B82F6] text-white py-3.5 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg hover:bg-blue-600 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "ចុះឈ្មោះ"
                  )}
                </button>

              </form>
            </div>

            {/* Footer Links */}
            <div className="mt-6 text-center border-t border-gray-100 pt-6">
              <p className="text-sm text-gray-600">
                មានគណនីរួចហើយ?{' '}
                <Link to="/login" className="text-[#3B82F6] font-semibold hover:underline transition-colors duration-300">
                  ចូលប្រើប្រាស់
                </Link>
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* CSS Keyframe Animations */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.7s ease-out forwards;
        }

        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeInRight {
          animation: fadeInRight 0.6s ease-out forwards;
        }

        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeInScale {
          animation: fadeInScale 0.8s ease-out forwards;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        /* Custom Scrollbar for the form */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

    </div>
  );
};

export default Register;