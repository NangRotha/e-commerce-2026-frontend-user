import ProductList from '../components/products/ProductList';

const Shop = () => {
  return (
    <div>
      {/* Modern Hero Banner Section */}
      <div className="relative bg-[#F0F4F8] py-16 md:py-24 overflow-hidden mt-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#25398C] rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#25398C] rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative container mx-auto px-4 text-center z-10">
          {/* Using font-moul for the header */}
          <h1 className="font-moul text-4xl md:text-5xl text-[#25398C] mb-4">
            ហាងរបស់យើង
          </h1>
          {/* Using font-khmer for the description */}
          <p className="font-khmer text-gray-600 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            ស្វែងរកផលិតផលដែលសាកសមនឹងរចនាប័ទ្មរបស់អ្នក។ រកឃើញផលិតផលថ្មីៗ និងការផ្តល់ជូនពិសេស។
          </p>
          
        </div>
      </div>

      {/* Product List Component */}
      <ProductList />
    </div>
  );
};

export default Shop;