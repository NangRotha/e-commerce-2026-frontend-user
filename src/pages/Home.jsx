import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { productAPI, categoryAPI, bannerAPI } from '../services/api';
import { FiArrowRight, FiStar, FiChevronLeft, FiChevronRight, FiShoppingCart } from 'react-icons/fi';
import { FaTruck, FaCheckCircle, FaHeadset, FaLock } from 'react-icons/fa';
import WishlistButton from '../components/common/WishlistButton';

// Helper to safely grab image URL
const getImageUrl = (url, fallback = '') => {
  if (!url) return fallback;
  if (url.startsWith('http')) return url;
  const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://127.0.0.1:8000';
  return `${baseUrl}${url}`;
};

const Home = () => {
  const [heroSlides, setHeroSlides] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const heroInterval = useRef();

  // Fallback Data (Used only if Backend returns empty or fails)
  const fallbackHeroSlides = [
    {
      title: "ឥតខ្សែ",
      subtitle: "Sony WH-CH720N",
      image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'
    },
    {
      title: "ហ្គេម",
      subtitle: "Logitech G Pro X",
      image_url: 'https://images.unsplash.com/photo-1612444530582-fc66183b16f7?auto=format&fit=crop&w=600&q=80'
    }
  ];

  // Fetch all Data from Backend
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        // 1. FETCH HERO BANNERS (Slides)
        try {
          const bannerRes = await bannerAPI.getAll();
          // Check if backend returned valid data. If yes, use it. Else, use fallback.
          const realBanners = bannerRes.data && Array.isArray(bannerRes.data) && bannerRes.data.length > 0 
            ? bannerRes.data 
            : fallbackHeroSlides;
          setHeroSlides(realBanners);
        } catch (e) {
          console.warn("Banner API failed, using fallbacks:", e);
          setHeroSlides(fallbackHeroSlides);
        }

        // 2. FETCH CATEGORIES
        try {
          const catRes = await categoryAPI.getAll();
          setCategories(catRes.data || []);
        } catch (e) {
          console.error("Error fetching categories:", e);
          setCategories([]);
        }

        // 3. FETCH FEATURED PRODUCTS (Limit 4)
        try {
          const featuredRes = await productAPI.getAll({ limit: 4 });
          setFeaturedProducts(featuredRes.data || []);
        } catch (e) {
          console.error("Error fetching products:", e);
          setFeaturedProducts([]);
        }

      } catch (error) {
        console.error('Critical Error loading homepage data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // Slider Controls
  const nextHero = () => setHeroIndex((prev) => (prev + 1) % Math.max(heroSlides.length, 1));
  const prevHero = () => setHeroIndex((prev) => (prev - 1 + Math.max(heroSlides.length, 1)) % Math.max(heroSlides.length, 1));

  // Auto Slide Interval
  useEffect(() => {
    if (heroSlides.length > 1) {
      heroInterval.current = setInterval(nextHero, 5000);
      return () => clearInterval(heroInterval.current);
    }
  }, [heroSlides.length]);

  const renderStars = (rating) => {
    return (
      <div className="flex text-yellow-400 text-xs">
        {[...Array(5)].map((_, i) => (
          <FiStar key={i} className={i < Math.round(rating || 0) ? 'fill-yellow-400' : ''} />
        ))}
      </div>
    );
  };

  const cardColors = [
    'bg-gradient-to-br from-gray-800 to-gray-900 text-white',
    'bg-gradient-to-br from-red-500 to-pink-500 text-white',
    'bg-gradient-to-br from-yellow-300 to-yellow-500 text-gray-900',
    'bg-gradient-to-br from-blue-600 to-blue-800 text-white',
    'bg-gradient-to-br from-green-500 to-green-700 text-white',
    'bg-gradient-to-br from-pink-400 to-pink-600 text-white'
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F8F9FA]">
        <div className="w-12 h-12 border-4 border-[#25398C] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    // <============ កែពណ៌ផ្ទៃខាងក្រោយពី bg-white ទៅ bg-[#F8F9FA] ============>
    <div className="bg-[#F8F9FA] min-h-screen font-sans pb-10 text-[#111827] mt-24">
      
      {/* 1. ANIMATED HERO SLIDER */}
      <div className="container mx-auto px-4 pt-6">
        <div className="relative w-full h-[500px] md:h-[600px] bg-[#F0F0F0] rounded-[40px] overflow-hidden shadow-sm flex flex-col md:flex-row">
          
          {/* Sliding Container */}
          <div 
            className="absolute inset-0 flex h-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${heroIndex * 100}%)` }}
          >
            {heroSlides.map((slide, idx) => (
              <div key={idx} className="min-w-full h-full flex flex-col md:flex-row">
                {/* Left Text Content */}
                <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center z-10 relative">
                  {/* Animate text only for the active slide */}
                  <div className={`${heroIndex === idx ? 'animate-fadeIn' : 'opacity-0'}`}>
                    <span className="text-gray-500 font-medium text-lg mb-2 block">
                      {slide.subtitle || slide.title || 'ឧបករណ៍ពិសេស'}
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-4 text-[#111827]">
                      {slide.title || 'ឥតខ្សែ'}
                    </h1>
                    <div className="text-[#C8C5A0] text-6xl md:text-8xl font-bold uppercase tracking-tighter opacity-90 -mt-2 mb-4">
                      {slide.title ? slide.title.toUpperCase() : 'កាស'}
                    </div>
                    <div className="mt-4">
                      <Link to="/shop" className="bg-[#E23D3D] text-white px-8 py-3 rounded-full font-medium text-sm hover:bg-red-700 transition hover:scale-105 active:scale-95 inline-block duration-200">
                        ទិញតាមប្រភេទ
                      </Link>
                    </div>
                    <div className="mt-6 max-w-xs">
                      <h4 className="font-bold text-sm mb-1">ការពិពណ៌នា</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {slide.description || 'ផលិតផលគុណភាពខ្ពស់ដែលផ្តល់នូវបទពិសោធន៍ល្អបំផុតសម្រាប់អ្នក។'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Right Image Content */}
                <div className="md:w-1/2 relative flex items-center justify-center p-10">
                  <img 
                    src={getImageUrl(slide.image_url || slide.url, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80')}
                    alt={slide.title || "Hero Product"}
                    className={`w-full max-w-md object-contain drop-shadow-2xl z-10 transition-all duration-700 ${heroIndex === idx ? 'animate-zoomInFast' : 'opacity-0 scale-95'}`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Slider Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {heroSlides.map((_, index) => (
              <button 
                key={index} 
                onClick={() => setHeroIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${heroIndex === index ? 'bg-[#111827] w-6' : 'bg-gray-400 hover:bg-gray-600'}`}
              />
            ))}
          </div>
          
          {/* Navigation Arrows */}
          <button onClick={prevHero} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/60 p-2 rounded-full shadow-sm hover:bg-white hover:shadow-md transition hover:scale-110 active:scale-95">
            <FiChevronLeft className="text-[#111827] text-xl" />
          </button>
          <button onClick={nextHero} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/60 p-2 rounded-full shadow-sm hover:bg-white hover:shadow-md transition hover:scale-110 active:scale-95">
            <FiChevronRight className="text-[#111827] text-xl" />
          </button>

        </div>
      </div>

      {/* 2. STAGGERED CATEGORIES GRID (Real Backend Data) */}
      {categories.length > 0 && (
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.slice(0, 6).map((cat, index) => (
              <div 
                key={cat.id} 
                className={`relative rounded-3xl p-6 h-48 md:h-52 flex items-center justify-between overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 ${cardColors[index % cardColors.length]} animate-fadeInUp`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="z-10 flex flex-col justify-between h-full">
                  <div>
                    <p className="text-[10px] uppercase opacity-70 tracking-wider mb-1">រីករាយ</p>
                    <h3 className="text-2xl font-bold leading-tight">{cat.name}</h3>
                  </div>
                  <div className="mt-auto">
                    <Link to={`/shop?category=${cat.id}`} className="bg-white/20 backdrop-blur-sm text-white bg-white text-xs font-semibold px-6 py-2 rounded-full hover:bg-white hover:text-gray-900 transition hover:scale-105 active:scale-95 inline-block">
                      រកមើល
                    </Link>
                  </div>
                </div>
                
                <div className="absolute right-0 bottom-0 h-full w-1/2 flex items-end justify-end transition-transform duration-300 hover:scale-110 hover:-translate-x-2">
                  <img 
                    src={getImageUrl(cat.image_url, 'https://via.placeholder.com/150')}
                    alt={cat.name}
                    className="w-full h-full object-contain drop-shadow-xl transform translate-x-4 translate-y-4"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. ANIMATED FEATURED PRODUCTS (Real Backend Data) */}
      {featuredProducts.length > 0 && (
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6 animate-fadeInUp">
            <h2 className="text-2xl font-bold text-[#111827]">ផលិតផលពេញនិយម</h2>
            <Link to="/shop" className="text-sm font-medium flex items-center gap-1 text-gray-600 hover:text-[#25398C] group transition-colors">
              មើលទាំងអស់ <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product, index) => (
              <div 
                key={product.id} 
                className="bg-white rounded-2xl p-4 transition-all duration-300 group hover:-translate-y-2 hover:shadow-lg animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Link to={`/product/${product.id}`} className="block relative h-40 mb-3 flex items-center justify-center bg-white rounded-xl overflow-hidden">
                  <img 
                    src={getImageUrl(product.images?.[0]?.image_url, 'https://via.placeholder.com/200')} 
                    alt={product.name} 
                    className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                  />
                </Link>
                <div className="flex items-center gap-1 mb-1">
                  {renderStars(product.rating || 0)}
                </div>
                <Link to={`/product/${product.id}`} className="block font-medium text-sm text-[#111827] hover:text-[#25398C] transition-colors line-clamp-2 h-10">
                  {product.name}
                </Link>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-bold text-base text-[#111827]">${product.price.toFixed(2)}</span>
                  <div className="flex items-center gap-1">
                    <WishlistButton productId={product.id} className="w-8 h-8" />
                    <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#111827] shadow-sm transition-all hover:bg-[#25398C] hover:text-white hover:scale-110 active:scale-95">
                      <FiShoppingCart size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. ICONS BAR (ដក border-t ចេញដើម្បីឱ្យរលោងជាងមុន) */}
      <div className="container mx-auto px-4 py-12 animate-fadeInUp">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: FaTruck, title: "ដឹកជញ្ជូនដោយឥតគិតថ្លៃ", desc: "ដឹកជញ្ជូនដោយឥតគិតថ្លៃសម្រាប់ការបញ្ជាទិញទាំងអស់។" },
            { icon: FaCheckCircle, title: "ការធានាប្រាក់", desc: "ធានាគុណភាពនៃផលិតផលរបស់យើង។" },
            { icon: FaHeadset, title: "គាំទ្រ ២៤/៧", desc: "គាំទ្រអតិថិជន ២៤ ម៉ោងក្នុងមួយថ្ងៃ។" },
            { icon: FaLock, title: "ការទូទាត់ប្រកបដោយសុវត្ថិភាព", desc: "ការទូទាត់ដែលមានសុវត្ថិភាពខ្ពស់។" }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center group transition-transform duration-300 hover:-translate-y-1">
              <item.icon className="text-[#E23D3D] text-3xl mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-sm text-[#111827]">{item.title}</h4>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. BOTTOM XBOX BANNER + ADDITIONAL CARDS */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Xbox Banner */}
          <div className="md:col-span-2 bg-[#3A9B38] rounded-[40px] p-8 md:p-12 flex flex-col md:flex-row items-center relative overflow-hidden shadow-sm h-[400px] group animate-fadeInUp">
            <div className="md:w-1/2 z-10 text-white">
              <span className="bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full text-xs inline-block mb-4">២០% បញ្ចុះតម្លៃ</span>
              <h2 className="text-6xl font-black leading-none tracking-tighter mb-2">XBOX</h2>
              <h2 className="text-6xl font-black leading-none tracking-tighter mb-2">SERIE</h2>
              <h2 className="text-6xl font-black leading-none tracking-tighter mb-6">X</h2>
              <p className="text-xs text-green-100 font-medium">១៥ វិច្ឆិកា ដល់ ៧ ធ្នូ</p>
            </div>
            
            <div className="md:w-1/2 h-full flex items-center justify-center z-10 relative mt-4 md:mt-0 transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-2">
              <img 
                src="https://cms-assets.xboxservices.com/assets/f0/8d/f08dfa50-f2ef-4873-bc8f-bcb6c34e48c0.png?n=642227_Hero-Gallery-0_C2_857x676.png" 
                alt="Xbox Series X" 
                className="w-full max-h-[300px] object-contain drop-shadow-2xl"
              />
            </div>

            <div className="absolute right-10 bottom-10 text-white text-right z-10 hidden md:block">
              <p className="font-medium text-lg">"បំពេញក្តីសុបិនរបស់អ្នក"</p>
              <p className="text-[10px] opacity-70 max-w-[150px] ml-auto mt-1 leading-relaxed">ផលិតផលដ៏ល្អបំផុតសម្រាប់អ្នកចូលចិត្តហ្គេម។</p>
              <button className="mt-3 bg-transparent border border-white text-white px-6 py-1.5 rounded-full text-xs hover:bg-white hover:text-[#3A9B38] transition hover:scale-105 active:scale-95">ទិញ</button>
            </div>
          </div>

          {/* Right side small card */}
          <div className="bg-[#FCE9F3] rounded-[40px] p-8 flex flex-col justify-between relative overflow-hidden shadow-sm h-[400px] group animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
            <div className="z-10">
              <p className="text-[10px] uppercase text-pink-600 font-semibold tracking-wider mb-1">ថ្មី</p>
              <h3 className="text-3xl font-bold text-[#111827] leading-tight mb-6">Amazon<br/>SPEAKER</h3>
              <button className="bg-white px-6 py-2 rounded-full text-xs font-semibold shadow-sm hover:shadow-md transition hover:scale-105 active:scale-95">
                រកមើល
              </button>
            </div>
            <div className="absolute bottom-0 right-0 w-3/4 h-3/4 flex items-end justify-end z-0 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-x-2">
              <img 
                src="https://taketalkbd.com/wp-content/uploads/2024/08/Amazon-Echo-Dot-4th.4.png" 
                alt="Speaker" 
                className="w-full object-contain drop-shadow-xl transform translate-x-4 translate-y-4"
              />
            </div>
          </div>

        </div>
      </div>

      {/* CSS for Keyframe Animations */}
      <style>{`
        /* Staggered Fade & Slide Up */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.7s ease-out forwards;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        /* Fast zoom for sliding images */
        @keyframes zoomInFast {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-zoomInFast {
          animation: zoomInFast 0.5s ease-out forwards;
        }

        /* Fade In / Out for Text */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.7s ease-out forwards;
        }
      `}</style>

    </div>
  );
};

export default Home;