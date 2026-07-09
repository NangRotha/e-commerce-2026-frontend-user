import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FaGoogle, FaApple, FaFacebookF } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate('/');
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#EBEDFF] via-[#F4F5FF] to-[#FFFFFF] flex items-center justify-center p-6 relative font-sans overflow-hidden">
      
      {/* Background Decorative Large Blob Shapes */}
      <div className="absolute top-[-20%] left-[-10%] w-[40rem] h-[40rem] bg-blue-400/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[40rem] h-[40rem] bg-purple-400/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Floating Card Container - បន្ថែម bg-[#F8F9FA] ដើម្បីកុំឱ្យថ្លាពេក */}
      <div className="mt-24 relative w-full max-w-6xl bg-[#F8F9FA] backdrop-blur-xl rounded-[3rem] shadow-2xl border border-white/40 p-8 md:p-12 flex flex-col lg:flex-row gap-12 overflow-hidden">
        
        {/* ========== LEFT SIDE: 3D ILLUSTRATION ========== */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between relative z-10">
          
          {/* 1. LOGO ONLY (ដាក់នៅកំពូលឆ្វេង) */}
          <div className="mb-8 lg:mb-0">
            <div className="text-3xl font-bold text-[#1A237E]">MarketPlace</div>
          </div>

          {/* 2. Welcome Text */}
          <div className="my-12 lg:my-0">
            <h1 className="text-4xl md:text-5xl font-bold text-[#3B82F6] mb-4 leading-tight animate-fade-in-up">
              ស្វាគមន៍មកកាន់ <br /> សហគមន៍របស់យើង
            </h1>
            <p className="text-gray-500 text-base leading-relaxed max-w-sm animate-fade-in-up animation-delay-200">
              ដំណើរការផលិតភាពថ្មីទាំងស្រុង ចាប់ផ្តើមនៅទីនេះ។
            </p>
          </div>

          {/* 3. 3D Illustration */}
          <div className="relative w-full h-[300px] lg:h-[400px] flex items-center justify-center my-8 lg:my-0">
            <img 
              src="https://i.pinimg.com/originals/7c/e9/e3/7ce9e34927261d3b035090cac779fec5.gif" 
              alt="3D Character with Rocket" 
              className="w-full h-full object-contain drop-shadow-xl"
            />
          </div>
        </div>

        {/* ========== RIGHT SIDE: LOGIN FORM ========== */}
        <div className="w-full lg:w-1/2 flex items-center justify-center z-10">
          <div className={`w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-8 md:p-10 transition-all duration-300 ${shake ? 'animate-shake' : 'animate-fade-in-right'}`}>
            
            {/* Form Header */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex gap-6 text-sm font-medium">
                <Link to="/login" className="text-[#3B82F6] border-b-2 border-[#3B82F6] pb-1">ចូលប្រើ</Link>
                <Link to="/register" className="text-gray-400 hover:text-gray-600 transition pb-1">បង្កើតគណនី</Link>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Email Input */}
              <div className="space-y-1">
                <input 
                  type="email" 
                  name="email" 
                  required
                  placeholder="បញ្ចូលអ៊ីមែលរបស់អ្នក"
                  className="w-full px-4 py-4 bg-[#F4F6FA] border-none rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all duration-300 placeholder-gray-400 text-sm"
                  value={formData.email} 
                  onChange={handleChange} 
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password" 
                    required
                    placeholder="ពាក្យសម្ងាត់"
                    className="w-full px-4 py-4 bg-[#F4F6FA] border-none rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all duration-300 placeholder-gray-400 text-sm pr-12"
                    value={formData.password} 
                    onChange={handleChange} 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3B82F6] transition-colors duration-300 focus:outline-none"
                  >
                    {showPassword ? <FiEye className="text-lg" /> : <FiEyeOff className="text-lg" />}
                  </button>
                </div>
              </div>

              {/* Options: Keep me logged in & Forgot Password */}
              <div className="flex items-center justify-between text-xs py-2">
                <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-[#3B82F6] focus:ring-[#3B82F6] border-gray-300 rounded" />
                  ចងចាំខ្ញុំ
                </label>
                <Link to="/forgot-password" className="text-gray-500 hover:text-[#3B82F6] transition">
                  បំភ្លេចពាក្យសម្ងាត់?
                </Link>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#3B82F6] text-white py-4 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg hover:bg-blue-600 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "ចូលប្រើប្រាស់"
                )}
              </button>

            </form>

          </div>
        </div>

      </div>

      {/* CSS Keyframe Animations */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.7s ease-out forwards;
          opacity: 0;
        }

        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-right {
          animation: fadeInRight 0.6s ease-out forwards;
          opacity: 0;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-400 { animation-delay: 0.4s; }
      `}</style>

    </div>
  );
};

export default Login;