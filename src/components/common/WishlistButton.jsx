import { FiHeart } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useWishlist } from '../../contexts/WishlistContext';

const WishlistButton = ({ productId, className = '' }) => {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const active = isWishlisted(productId);

  return (
    <motion.button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(productId);
      }}
      whileTap={{ scale: 0.85 }}
      whileHover={{ scale: 1.1 }}
      className={`flex items-center justify-center rounded-full shadow-sm transition-colors bg-white/80 backdrop-blur-sm text-[#E23D3D] ${className}`}
      title={active ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <FiHeart className={`text-lg ${active ? 'fill-[#E23D3D]' : ''}`} />
    </motion.button>
  );
};

export default WishlistButton;
