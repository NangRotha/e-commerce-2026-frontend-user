import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Import Framer Motion
import { productAPI, categoryAPI } from '../../services/api';
import { FiShoppingCart, FiFilter, FiX } from 'react-icons/fi';
import { cartAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import WishlistButton from '../common/WishlistButton';

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // 0.1s delay between each product appearing
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

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    size: '',
    color: '',
    minPrice: '',
    maxPrice: '',
    search: '',
  });

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll(filters);
      setProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadProducts();
  };

  const clearFilters = () => {
    setFilters({
      category: '', brand: '', size: '', color: '', minPrice: '', maxPrice: '', search: ''
    });
  };

  const handleAddToCart = async (productId) => {
    await addToCart(productId, 1, 'M', 'Black');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-10 font-khmer"
    >
      
      {/* Mobile Filter Toggle Button */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="md:hidden mb-6 flex justify-end"
      >
        <button 
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md text-[#25398C] font-medium transition hover:shadow-lg"
        >
          <FiFilter /> តម្រង
        </button>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-8 relative">
        
        {/* Filters Sidebar */}
        <AnimatePresence>
          {mobileFiltersOpen && (
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-0 z-50 bg-white md:hidden w-full"
            >
              <div className="p-4 border-b flex justify-between items-center bg-white">
                <span className="font-moul text-lg">តម្រង</span>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition">
                  <FiX size={24} />
                </button>
              </div>
              {/* Sidebar Content (Same as Desktop but scrollable) */}
              <div className="p-6 h-full overflow-y-auto pb-20">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-moul text-lg text-[#25398C]">តម្រង</h3>
                  <button onClick={clearFilters} className="text-xs text-gray-500 hover:text-red-500 underline transition">សម្អាតទាំងអស់</button>
                </div>
                {/* ... Filter inputs (Reusing identical markup) ... */}
                <form onSubmit={handleSearch} className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">ស្វែងរក</label>
                  <input type="text" name="search" placeholder="វាយបញ្ចូល..." 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#25398C] text-sm transition" 
                    value={filters.search} onChange={handleFilterChange} />
                </form>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ប្រភេទ</label>
                    <select name="category" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#25398C] text-sm" value={filters.category} onChange={handleFilterChange}>
                      <option value="">ទាំងអស់</option>
                      {categories.map((cat) => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">តម្លៃ</label>
                    <div className="flex gap-3">
                      <input type="number" name="minPrice" placeholder="$ អប្បបរមា" className="w-1/2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#25398C] text-sm" value={filters.minPrice} onChange={handleFilterChange} />
                      <input type="number" name="maxPrice" placeholder="$ អតិបរមា" className="w-1/2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#25398C] text-sm" value={filters.maxPrice} onChange={handleFilterChange} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ទំហំ</label>
                    <select name="size" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#25398C] text-sm" value={filters.size} onChange={handleFilterChange}>
                      <option value="">ទាំងអស់</option>
                      <option value="S">S</option><option value="M">M</option><option value="L">L</option>
                      <option value="XL">XL</option><option value="XXL">XXL</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ពណ៌</label>
                    <select name="color" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#25398C] text-sm" value={filters.color} onChange={handleFilterChange}>
                      <option value="">ទាំងអស់</option>
                      <option value="Black">ខ្មៅ</option><option value="White">ស</option>
                      <option value="Blue">ខៀវ</option><option value="Red">ក្រហម</option>
                    </select>
                  </div>
                </div>
                {/* Apply Button */}
                <div className="pt-6 mt-6 border-t border-gray-100">
                  <button onClick={() => setMobileFiltersOpen(false)} className="w-full bg-[#25398C] text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition hover:scale-[1.02] active:scale-95">អនុវត្ត</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Filters Sidebar (Static) */}
        <div className="hidden md:block w-64 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-20">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-moul text-lg text-[#25398C]">តម្រង</h3>
            <button onClick={clearFilters} className="text-xs text-gray-500 hover:text-red-500 underline transition">សម្អាតទាំងអស់</button>
          </div>
          <form onSubmit={handleSearch} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">ស្វែងរក</label>
            <input type="text" name="search" placeholder="វាយបញ្ចូល..." 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#25398C] text-sm transition" 
              value={filters.search} onChange={handleFilterChange} />
          </form>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ប្រភេទ</label>
              <select name="category" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#25398C] text-sm" value={filters.category} onChange={handleFilterChange}>
                <option value="">ទាំងអស់</option>
                {categories.map((cat) => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">តម្លៃ</label>
              <div className="flex gap-3">
                <input type="number" name="minPrice" placeholder="$ អប្បបរមា" className="w-1/2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#25398C] text-sm" value={filters.minPrice} onChange={handleFilterChange} />
                <input type="number" name="maxPrice" placeholder="$ អតិបរមា" className="w-1/2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#25398C] text-sm" value={filters.maxPrice} onChange={handleFilterChange} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ទំហំ</label>
              <select name="size" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#25398C] text-sm" value={filters.size} onChange={handleFilterChange}>
                <option value="">ទាំងអស់</option>
                <option value="S">S</option><option value="M">M</option><option value="L">L</option>
                <option value="XL">XL</option><option value="XXL">XXL</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ពណ៌</label>
              <select name="color" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#25398C] text-sm" value={filters.color} onChange={handleFilterChange}>
                <option value="">ទាំងអស់</option>
                <option value="Black">ខ្មៅ</option><option value="White">ស</option>
                <option value="Blue">ខៀវ</option><option value="Red">ក្រហម</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-12 h-12 border-4 border-[#25398C] border-t-transparent rounded-full"
              />
            </div>
          ) : products.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 bg-gray-50 rounded-3xl"
            >
              <h3 className="font-moul text-xl text-gray-600">រកមិនឃើញផលិតផល</h3>
              <p className="font-khmer text-gray-400 mt-2">សូមព្យាយាមកែតម្រូវតម្រង ឬពាក្យស្វែងរករបស់អ្នក។</p>
            </motion.div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {products.map((product) => (
                <motion.div 
                  key={product.id} 
                  variants={itemVariants}
                  whileHover={{ y: -8, boxShadow: "0px 15px 30px rgba(0,0,0,0.08)" }}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 group"
                >
                  
                  {/* Image Container with Badges */}
                  <Link to={`/product/${product.id}`}>
                    <div className="relative h-64 bg-gray-50 overflow-hidden">
                      {product.images?.length > 0 ? (
                        <motion.img 
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 400 }}
                          src={product.images[0].image_url} 
                          alt={product.name} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">គ្មានរូបភាព</div>
                      )}
                      
                      {/* Discount Badge */}
                      {product.discount > 0 && (
                        <motion.span 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="absolute top-4 right-4 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md"
                        >
                          -{product.discount}%
                        </motion.span>
                      )}
                    </div>
                  </Link>

                  {/* Product Details */}
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <Link to={`/product/${product.id}`}>
                        <h3 className="font-khmer text-md font-bold text-gray-800 mb-1 group-hover:text-[#25398C] transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>
                      {/* Rating */}
                      <div className="flex text-yellow-400 text-[10px] gap-0.5">
                        {[...Array(5)].map((_, i) => (
                           <span key={i}>{i < Math.round(product.rating || 0) ? '★' : '☆'}</span>
                        ))}
                      </div>
                    </div>

                    {/* Brand / Category */}
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                      <span>{product.brand || 'ម៉ាក'}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span>{product.category || 'ប្រភេទ'}</span>
                    </div>

                    {/* Footer: Price & Cart */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                      <div>
                        {product.discount > 0 ? (
                          <div className="flex items-end gap-2">
                            <span className="text-xl font-bold text-[#25398C]">
                              ${(product.price * (1 - product.discount/100)).toFixed(2)}
                            </span>
                            <span className="text-xs text-gray-400 line-through">
                              ${product.price.toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xl font-bold text-[#25398C]">${product.price.toFixed(2)}</span>
                        )}
                      </div>
                      
                       <motion.button 
                         onClick={() => handleAddToCart(product.id)} 
                         whileHover={{ scale: 1.1, backgroundColor: "#1a266b" }}
                         whileTap={{ scale: 0.9 }}
                         className="bg-[#25398C] text-white p-2.5 rounded-xl shadow-md transition-colors"
                       >
                         <FiShoppingCart size={18} />
                       </motion.button>
                       <WishlistButton productId={product.id} className="p-2.5" />
                     </div>
                   </div>
                 </motion.div>
               ))}
             </motion.div>
           )}
         </div>
       </div>
     </motion.div>
   );
 };

 export default ProductList;