import ProductList from '../components/products/ProductList';

const Shop = () => {
  return (
    <div>
      {/* Modern Hero Banner Section with Animations */}
      <div className="relative bg-[#F8F9FA] py-16 md:py-24 overflow-hidden mt-24">
        
        {/* Gradient Blobs Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#25398C] rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#25398C] rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
        </div>
        
        {/* Content Container */}
        <div className="relative container mx-auto px-4 text-center z-10">
          
          {/* Title - Fade In Up with delay */}
          <h1 className="font-moul text-4xl md:text-5xl text-[#25398C] mb-4 animate-fadeInUp opacity-0">
            ហាងរបស់យើង
          </h1>
          
          {/* Description - Fade In Up with longer delay */}
          <p className="font-khmer text-gray-600 text-lg md:text-xl max-w-2xl mx-auto mb-8 animate-fadeInUp opacity-0 animation-delay-200">
            ស្វែងរកផលិតផលដែលសាកសមនឹងរចនាប័ទ្មរបស់អ្នក។ រកឃើញផលិតផលថ្មីៗ និងការផ្តល់ជូនពិសេស។
          </p>
          
          {/* Optional Button to Browse (Animation included) */}
          <div className="animate-fadeInUp opacity-0 animation-delay-400">
            <button 
              onClick={() => window.scrollTo({ top: document.getElementById('product-list-section')?.offsetTop || 0, behavior: 'smooth' })}
              className="bg-[#25398C] text-white px-8 py-3 rounded-full font-medium text-sm hover:bg-blue-800 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              រកមើលផលិតផល
            </button>
          </div>
          
        </div>
      </div>

      {/* Product List Component with Anchor ID for smooth scroll */}
      <div id="product-list-section">
        <ProductList />
      </div>

      {/* CSS for Animations (ដាក់នៅក្នុង style) */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.2;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.3;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>

    </div>
  );
};

export default Shop;