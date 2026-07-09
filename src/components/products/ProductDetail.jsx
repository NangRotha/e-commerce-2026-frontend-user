import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { productAPI, reviewAPI, cartAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import WishlistButton from '../common/WishlistButton';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiHeart, FiBox, FiStar, FiFacebook, FiTwitter, FiInstagram, FiArrowLeft } from 'react-icons/fi';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('Review');
  const [selectedImage, setSelectedImage] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  // ទាញយកទិន្នន័យពី Backend នៅពេលទំព័រផ្ទុក
  useEffect(() => {
    loadProduct();
    loadReviews();
  }, [id]);

  const loadProduct = async () => {
    try {
      const response = await productAPI.getById(id);
      const productData = response.data;
      setProduct(productData);

      // **កែតម្រូវ៖ ទាញយក Size & Color ពី Backend (បើមាន)**
      if (productData.variants && productData.variants.length > 0) {
        // ឧទាហរណ៍៖ បើ Backend មាន variants យើងយកវាមកដាក់ជម្រើសដំបូង
        const firstVariant = productData.variants[0];
        setSelectedSize(firstVariant.size || '');
        setSelectedColor(firstVariant.color || '');
      } else {
        // បើគ្មាន variant យើងអាចប្រើ Fallback data ដើម្បីកុំឱ្យ UI ដាច់
        setSelectedSize('M');
        setSelectedColor('ខ្មៅ');
      }

      // កំណត់រូបភាពដំបូង
      if (productData.images?.length > 0) {
        setSelectedImage(productData.images[0].image_url);
      }
    } catch (error) {
      toast.error('មិនឃើញផលិតផល');
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const response = await reviewAPI.getByProduct(id);
      setReviews(response.data);
    } catch (error) {
      console.error('Error loading reviews');
    }
  };

  // **កែតម្រូវ៖ គណនា Rating ជាមធ្យមពី Backend ដោយស្វ័យប្រវត្តិ**
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const handleAddToCart = async () => {
    await addToCart(
      parseInt(id),
      quantity,
      selectedSize,
      selectedColor
    );
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('សូមចូលប្រើដើម្បីផ្តល់មតិ');
      return;
    }
    try {
      await reviewAPI.create({
        product_id: parseInt(id),
        rating: reviewRating,
        comment: reviewText,
      });
      toast.success('មតិរបស់អ្នកបានដាក់ស្នើដោយជោគជ័យ!');
      setReviewText('');
      loadReviews();
      // បន្ទាប់ពីដាក់ Review រួច កុំភ្លេចគណនា Rating ឡើងវិញ
    } catch (error) {
      toast.error('មិនអាចដាក់ស្នើមតិបានទេ');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5D1E8A]"></div></div>;
  if (!product) return <div className="text-center py-20 text-red-500">រកមិនឃើញផលិតផល</div>;

  const averageRating = calculateAverageRating();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white min-h-screen font-khmer"
    >
      <div className="container mx-auto px-4 py-8 md:py-12 relative mt-20"> {/* ដក 'absolute top-4' ចេញ និងដាក់ mt-20 ត្រឹមត្រូវ */}
        
        {/* BACK BUTTON */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 md:static md:mb-6 flex items-center gap-2 text-gray-600 hover:text-[#5D1E8A] transition-colors bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full font-medium"
        >
          <FiArrowLeft /> ត្រឡប់ក្រោយ
        </motion.button>

        {/* BREADCRUMBS & HEADER */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-10 pt-8 md:pt-0"
        >
          <h1 className="text-4xl font-moul text-gray-800 mb-2">ហាង</h1>
          <div className="flex justify-center gap-2 text-sm text-gray-500">
            <span>ទំព័រដើម</span> / <span>ហាង</span> / <span className="text-gray-800">ព័ត៌មានលម្អិត</span>
          </div>
        </motion.div>

        {/* MAIN PRODUCT LAYOUT */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* LEFT: IMAGES */}
          <motion.div 
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-1/2"
          >
            <div className="bg-[#F9F9F9] rounded-2xl p-6 overflow-hidden aspect-square flex items-center justify-center shadow-sm relative">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={selectedImage}
                  src={selectedImage} 
                  alt={product.name} 
                  initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.9, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-contain mix-blend-multiply absolute"
                />
              </AnimatePresence>
            </div>
            
            {/* Sub-Images */}
            <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
              {product.images?.map((img, i) => (
                <motion.button 
                  key={i} 
                  onClick={() => setSelectedImage(img.image_url)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-shrink-0 w-20 h-20 bg-[#F9F9F9] rounded-lg p-2 border-2 transition-all cursor-pointer overflow-hidden ${
                    selectedImage === img.image_url ? 'border-[#5D1E8A]' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img src={img.image_url} alt={`${product.name} ${i}`} className="w-full h-full object-contain mix-blend-multiply" />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* RIGHT: DETAILS */}
          <motion.div 
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full lg:w-1/2"
          >
            <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">{product.category}</p>
            <h1 className="text-3xl md:text-4xl font-moul text-gray-800 mb-3">{product.name}</h1>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="flex text-yellow-400 text-sm">
                {[...Array(5)].map((_, i) => <FiStar key={i} className={i < Math.round(averageRating) ? 'fill-yellow-400' : ''} />)}
              </div>
              <span className="text-sm text-gray-500">({reviews.length} មតិ)</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">មានស្តុក</span>
            </div>

            <div className="flex items-end gap-3 mb-6">
              <span className="text-3xl font-bold text-gray-900">
                ${product.discount > 0 ? (product.price * (1 - product.discount/100)).toFixed(2) : product.price.toFixed(2)}
              </span>
              {product.discount > 0 && (
                <span className="text-lg text-gray-400 line-through">${product.price.toFixed(2)}</span>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed mb-8 text-sm">{product.description}</p>

            {/* SIZE SELECTION (ទាញយកពី Backend) */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-8">
                <h4 className="font-bold text-sm text-gray-800 mb-3">ទំហំ</h4>
                <div className="grid grid-cols-3 gap-4">
                  {product.variants.map((variant, index) => (
                    <motion.button 
                      key={index} 
                      onClick={() => setSelectedSize(variant.size)}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${selectedSize === variant.size ? 'border-[#5D1E8A] bg-[#FDF4FF]' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                    >
                      <span className={`text-2xl mb-1 ${selectedSize === variant.size ? 'text-[#5D1E8A]' : 'text-gray-400'}`}><FiBox /></span>
                      <span className="text-[10px] font-semibold text-gray-800">{variant.size}</span>
                      <span className="text-[9px] text-gray-500">${variant.price || product.price}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* COLOR SELECTION (ទាញយកពី Backend) */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-8">
                <h4 className="font-bold text-sm text-gray-800 mb-3">ពណ៌ : <span className="font-normal">{selectedColor}</span></h4>
                <div className="flex gap-3">
                  {product.variants.map((variant, index) => (
                    <motion.button 
                      key={index} 
                      onClick={() => setSelectedColor(variant.color)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === variant.color ? 'border-[#5D1E8A] p-1' : 'border-transparent'}`}
                    >
                      <div className="w-full h-full rounded-full bg-blue-400"></div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* CARD MESSAGE INPUT */}
            <div className="mb-8">
              <h4 className="font-bold text-sm text-gray-800 mb-3">សារនៅលើកាត</h4>
              <textarea 
                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:border-[#5D1E8A] focus:ring-1 focus:ring-[#5D1E8A] text-sm bg-gray-50 placeholder:text-gray-400 resize-none transition-all" 
                rows="3" 
                placeholder="បញ្ចូលសាររបស់អ្នក..."
              ></textarea>
            </div>

            {/* QUANTITY & BUTTONS */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center bg-white border border-gray-200 rounded-full">
                <button onClick={() => setQuantity(Math.max(1, quantity-1))} className="px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-l-full transition">−</button>
                <span className="px-3 py-3 font-medium text-sm w-12 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity+1)} className="px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-r-full transition">+</button>
              </div>
              
              <motion.button 
                onClick={handleAddToCart} 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#5D1E8A] text-white px-8 py-3 rounded-full hover:bg-purple-900 transition shadow-md flex-1 md:flex-none"
              >
                បន្ថែមទៅកន្ត្រក
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full hover:opacity-90 transition shadow-md flex-1 md:flex-none"
              >
                ទិញឥឡូវនេះ
              </motion.button>
              
              <WishlistButton productId={product.id} className="w-12 h-12 border border-gray-200" />
            </div>

            {/* SKU & TAGS */}
            <div className="border-t border-gray-100 pt-6 text-sm text-gray-600 space-y-2">
              <p>SKU : <span className="text-gray-800">{product.sku || 'N/A'}</span></p>
              <p>ស្លាក : <span className="text-gray-800">{product.tags || 'ទូទៅ'}</span></p>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">ចែករំលែក :</span>
                <span className="flex gap-2 text-[#5D1E8A]">
                  <FiFacebook className="cursor-pointer" />
                  <FiTwitter className="cursor-pointer" />
                  <FiInstagram className="cursor-pointer" />
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* TABS & RATINGS */}
        <div className="mt-20">
          <div className="flex justify-center gap-8 md:gap-12 border-b border-gray-200 pb-4 mb-10">
            {['ការពិពណ៌នា', 'ព័ត៌មានបន្ថែម', 'មតិអ្នកប្រើ'].map((tab, index) => {
              const engTab = ['Description', 'Additional Information', 'Review'][index];
              return (
                <motion.button 
                  key={tab} 
                  onClick={() => setActiveTab(engTab)}
                  whileHover={{ y: -2 }}
                  className={`font-medium text-sm md:text-base pb-1 transition-colors ${activeTab === engTab ? 'text-[#5D1E8A] border-b-2 border-[#5D1E8A]' : 'text-gray-500 hover:text-gray-800'}`}
                >
                  {tab}
                </motion.button>
              );
            })}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12 bg-white p-8 rounded-2xl"
          >
            <div className="flex flex-col items-center justify-center border-r md:border-r border-gray-100">
              <div className="text-6xl font-bold text-gray-900">{averageRating}</div>
              <div className="text-sm text-gray-500 mb-2">ក្នុងចំណោម 5</div>
              <div className="flex text-yellow-400 text-xl mb-1">
                {[...Array(5)].map((_, i) => <FiStar key={i} className={i < Math.round(averageRating) ? 'fill-yellow-400' : 'text-gray-300'} />)}
              </div>
              <div className="text-xs text-gray-400">({reviews.length} មតិ)</div>
            </div>

            {/* គណនាភាគរយនៃផ្កាយនីមួយៗ ដោយស្វ័យប្រវត្តិពី Backend */}
            <div className="md:col-span-2 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter(r => r.rating === star).length;
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-3 text-sm">
                    <span className="w-12 text-gray-600">{star} ផ្កាយ</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.5 + (5 - star) * 0.1 }}
                        className="h-full bg-yellow-400 rounded-full"
                      ></motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* REVIEW LIST */}
        <div className="mt-12">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex justify-between items-center mb-8"
          >
            <h2 className="text-2xl font-moul text-gray-800">បញ្ជីមតិ</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>តម្រៀបតាម :</span>
              <select className="border border-gray-200 rounded-full px-4 py-1.5 outline-none bg-white">
                <option>ថ្មីបំផុត</option>
                <option>ចាស់បំផុត</option>
                <option>ពិន្ទុខ្ពស់</option>
              </select>
            </div>
          </motion.div>

          {isAuthenticated && (
            <motion.form 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              onSubmit={submitReview} 
              className="bg-gray-50 p-6 rounded-2xl mb-10 border border-gray-100"
            >
              <h3 className="font-semibold text-gray-800 mb-4">សរសេរមតិ</h3>
              <div className="flex gap-2 mb-4 text-3xl text-yellow-400">
                {[1,2,3,4,5].map((star) => (
                  <motion.button 
                    key={star} 
                    type="button" 
                    onClick={() => setReviewRating(star)} 
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="transition"
                  >
                    {star <= reviewRating ? '★' : '☆'}
                  </motion.button>
                ))}
              </div>
              <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#5D1E8A] mb-4" rows="3" placeholder="ចែករំលែកបទពិសោធន៍របស់អ្នក..."></textarea>
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                type="submit" 
                className="bg-[#5D1E8A] text-white px-6 py-2 rounded-full hover:bg-purple-900 transition"
              >
                ដាក់ស្នើមតិ
              </motion.button>
            </motion.form>
          )}

          <div className="space-y-8">
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-10">មិនទាន់មានមតិនៅឡើយទេ។ សូមក្លាយជាអ្នកដំបូង!</p>
            ) : (
              reviews.map((review, index) => {
                const reviewImages = review.images || (review.image_url ? [review.image_url] : []);

                return (
                  <motion.div 
                    key={review.id} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.8 + (index * 0.1) }}
                    className="border-b border-gray-100 pb-8 mb-8 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-purple-100 text-[#5D1E8A] flex items-center justify-center font-bold text-lg">
                        {review.username?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <span className="font-semibold text-gray-800">{review.username}</span>
                            <span className="ml-2 text-[10px] text-green-600 border border-green-200 px-2 py-0.5 rounded-full">(បានបញ្ជាក់)</span>
                          </div>
                          <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex text-yellow-400 text-xs mb-2">
                          {[...Array(5)].map((_, i) => <FiStar key={i} className={i < review.rating ? 'fill-yellow-400' : 'text-gray-300'} />)}
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">{review.comment}</p>
                        
                        {reviewImages && reviewImages.length > 0 ? (
                          <div className="flex gap-3 flex-wrap">
                            {reviewImages.map((imgUrl, i) => (
                              <div key={i} className="w-16 h-16 md:w-20 md:h-20 bg-[#F3F4F6] rounded-lg overflow-hidden border border-gray-200">
                                <img src={imgUrl} alt="Review" className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                        ) : null}

                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetail;