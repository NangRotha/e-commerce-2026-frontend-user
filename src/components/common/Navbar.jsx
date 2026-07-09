import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiHeart, FiUser, FiSearch, FiMenu, FiX, FiShoppingCart } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useWishlist } from '../../contexts/WishlistContext';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { wishlistCount } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Scroll detection for sticky hide/show effect
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      
      // Check if scrolled past 50px to add shadow
      setScrolled(currentScrollPos > 50);

      // Check if moving down or up
      const isScrolledDown = prevScrollPos < currentScrollPos;
      setVisible(!(isScrolledDown && currentScrollPos > 100));
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setMobileMenuOpen(false); // Close mobile menu if open
    }
  };

  // Close menu when a link is clicked on mobile
  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className={`w-full flex justify-center px-4 mt-6 mb-4 fixed top-0 z-50 pointer-events-none transition-all duration-500 ease-in-out ${
      visible ? 'translate-y-0 opacity-100' : '-translate-y-[120%] opacity-0'
    }`}>
      
      {/* Actual Navbar - Glass Effect Container */}
      <nav className={`w-full max-w-6xl bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] transition-all duration-300 pointer-events-auto relative ${
        scrolled ? 'py-3 px-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)]' : 'py-4 px-6'
      }`}>
        
        <div className="flex justify-between items-center gap-2 md:gap-6">
          
          {/* Logo */}
          <Link to="/" className="text-xl md:text-2xl font-bold text-[#3B82F6] tracking-tight whitespace-nowrap hover:scale-105 active:scale-95 transition-all duration-300">
            MarketPlace
          </Link>

          {/* ===== MOBILE HAMBURGER BUTTON ===== */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-600 text-2xl p-2 hover:bg-white/60 rounded-full transition-all duration-300 active:scale-90"
          >
            {mobileMenuOpen ? <FiX className="animate-spin-slow" /> : <FiMenu />}
          </button>

          {/* ===== DESKTOP MENU LINKS ===== */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link to="/" className="relative group pb-1 transition-colors duration-300 hover:text-[#3B82F6]">
              <span>ទំព័រដើម</span>
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[#3B82F6] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/shop" className="relative group pb-1 transition-colors duration-300 hover:text-[#3B82F6]">
              <span>ហាង</span>
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[#3B82F6] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/orders" className="relative group pb-1 transition-colors duration-300 hover:text-[#3B82F6]">
              <span>ការបញ្ជាទិញ</span>
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[#3B82F6] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          {/* ===== SEARCH BAR ===== */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-colors duration-300 group-focus-within:text-[#3B82F6]" />
            <input 
              type="text" 
              placeholder="ស្វែងរកផលិតផល..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100/50 border border-white/50 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all duration-300 placeholder-gray-400"
            />
          </form>

          {/* ===== ICONS ===== */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Cart Icon */}
            <Link to="/cart" className="p-2.5 hover:bg-white/60 rounded-full transition-all duration-300 hover:shadow-md active:scale-90">
              <FiShoppingCart className="text-xl text-gray-600 transition-colors duration-300 hover:text-[#3B82F6]" />
            </Link>
            
            {/* Wishlist Icon */}
            <Link to="/wishlist" className="relative p-2.5 hover:bg-white/60 rounded-full transition-all duration-300 hover:shadow-md active:scale-90">
              <FiHeart className="text-xl text-gray-600 transition-colors duration-300 hover:text-[#3B82F6]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#E23D3D] text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold border-2 border-white animate-bounce shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>
            
            {/* User / Auth */}
            {isAuthenticated ? (
              <div className="relative group hidden md:block">
                <button className="p-2.5 hover:bg-white/60 rounded-full transition-all duration-300 hover:shadow-md active:scale-90">
                  <FiUser className="text-xl text-gray-600 transition-colors duration-300 hover:text-[#3B82F6]" />
                </button>
                
                {/* Desktop Dropdown */}
                <div className="absolute right-0 mt-3 w-44 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right group-hover:scale-100 scale-95 z-50 overflow-hidden">
                  <div className="py-2">
                    <Link to="/profile" className="block px-4 py-2.5 hover:bg-[#3B82F6]/10 text-sm text-gray-700 transition-colors duration-200">
                      ប្រវត្តិរូប
                    </Link>
                    <Link to="/orders" className="block px-4 py-2.5 hover:bg-[#3B82F6]/10 text-sm text-gray-700 transition-colors duration-200">
                      ការបញ្ជាទិញ
                    </Link>
                    <div className="border-t border-gray-100/80 my-1 mx-2"></div>
                    <button 
                      onClick={logout} 
                      className="block w-full text-left px-4 py-2.5 hover:bg-red-50/80 text-sm text-red-500 transition-colors duration-200"
                    >
                      ចេញ
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="p-2.5 hover:bg-white/60 rounded-full transition-all duration-300 hover:shadow-md active:scale-90 hidden md:block">
                <FiUser className="text-xl text-gray-600 transition-colors duration-300 hover:text-[#3B82F6]" />
              </Link>
            )}
          </div>
        </div>

        {/* ===== MOBILE DROPDOWN MENU WITH ANIMATIONS ===== */}
        <div className={`md:hidden absolute top-full left-0 right-0 mt-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-4 flex flex-col gap-3 z-50 origin-top transition-all duration-300 ease-out ${
          mobileMenuOpen ? 'opacity-100 scale-y-100 translate-y-0 visible' : 'opacity-0 scale-y-95 -translate-y-4 invisible'
        }`}>
          <Link to="/" onClick={handleMobileLinkClick} className="px-4 py-2 hover:bg-[#3B82F6]/10 rounded-xl text-gray-700 transition-colors duration-200 font-medium text-sm active:scale-95">
            ទំព័រដើម
          </Link>
          <Link to="/shop" onClick={handleMobileLinkClick} className="px-4 py-2 hover:bg-[#3B82F6]/10 rounded-xl text-gray-700 transition-colors duration-200 font-medium text-sm active:scale-95">
            ហាង
          </Link>
          <Link to="/orders" onClick={handleMobileLinkClick} className="px-4 py-2 hover:bg-[#3B82F6]/10 rounded-xl text-gray-700 transition-colors duration-200 font-medium text-sm active:scale-95">
            ការបញ្ជាទិញ
          </Link>
          
          <form onSubmit={handleSearch} className="relative group mt-2 px-2">
            <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-colors duration-300 group-focus-within:text-[#3B82F6]" />
            <input 
              type="text" 
              placeholder="ស្វែងរកផលិតផល..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100/50 border border-white/50 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all duration-300 placeholder-gray-400"
            />
          </form>

          <div className="border-t border-gray-100/80 mt-2 pt-3 px-2">
            {isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <Link to="/profile" onClick={handleMobileLinkClick} className="px-4 py-2 hover:bg-[#3B82F6]/10 rounded-xl text-gray-700 transition-colors duration-200 text-sm active:scale-95">
                  ប្រវត្តិរូប
                </Link>
                <button 
                  onClick={() => { logout(); handleMobileLinkClick(); }} 
                  className="px-4 py-2 hover:bg-red-50/80 rounded-xl text-red-500 transition-colors duration-200 text-sm text-left active:scale-95"
                >
                  ចេញ
                </button>
              </div>
            ) : (
              <Link to="/login" onClick={handleMobileLinkClick} className="block px-4 py-2 bg-[#3B82F6] text-white text-center rounded-xl hover:bg-blue-600 transition-colors duration-200 text-sm font-medium active:scale-95">
                ចូលប្រើប្រាស់
              </Link>
            )}
          </div>
        </div>

      </nav>
    </div>
  );
};

export default Navbar;