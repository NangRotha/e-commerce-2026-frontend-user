import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderAPI } from '../../services/api';
import { motion } from 'framer-motion';

const BASE_URL = 'http://127.0.0.1:8000';

const getFullImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=200&q=80';

const getItemImage = (item) => {
  if (item.product_image) return item.product_image;
  if (item.image_url) return item.image_url;
  if (item.product && item.product.image_url) return item.product.image_url;
  if (item.product && item.product.images && item.product.images.length > 0) {
    return item.product.images[0].image_url;
  }
  if (item.images && item.images.length > 0) {
    return item.images[0].image_url;
  }
  return null;
};

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const response = await orderAPI.getById(id);
      setOrder(response.data);
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-600">រកមិនឃើញការបញ្ជាទិញ។</p>
        <Link to="/orders" className="text-[#3B82F6] hover:underline mt-2 inline-block">ត្រឡប់ការបញ្ជាទិញ</Link>
      </div>
    );
  }

  const calculatedTotal = order.items?.reduce((total, item) => {
    const price = item.price || item.unit_price || 0;
    const qty = item.quantity || item.qty || 0;
    return total + (price * qty);
  }, 0) || order.total_price || 0;

  const formattedDate = new Date(order.created_at || order.date || Date.now())
    .toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-[#FAFAFA] min-h-screen font-khmer pb-12 pt-28"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <Link to="/orders" className="text-sm text-gray-500 hover:text-[#3B82F6] mb-4 inline-block">← ត្រឡប់ការបញ្ជាទិញ</Link>

        <div className="text-center mb-8 animate-fadeInUp">
          <h1 className="text-3xl font-moul text-gray-800 mb-2">ព័ត៌មានការបញ្ជាទិញ #{order.id}</h1>
          <p className="text-sm text-gray-500">{formattedDate}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
          <div className="space-y-6">
            {order.items?.map((item, itemIndex) => {
              const itemPrice = item.price || item.unit_price || 0;
              const itemQty = item.quantity || item.qty || 1;
              const itemTotal = itemPrice * itemQty;
              const imgUrl = getItemImage(item);

              return (
                <div key={item.id || itemIndex} className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="w-24 h-24 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden border border-gray-200">
                    <img
                      src={getFullImageUrl(imgUrl) || FALLBACK_IMG}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_IMG;
                      }}
                      alt={item.product_name || 'Product'}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-800">
                      {item.product_name || item.name || `ផលិតផល #${item.product_id}`}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.description || item.variant || 'ទំនិញទូទៅ'}
                    </p>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <p>ចំនួន: <span className="font-medium">{itemQty}</span></p>
                      <p>ពណ៌/ទំហំ: <span className="font-medium">{item.color || '-'} / {item.size || '-'}</span></p>
                    </div>
                  </div>

                  <div className="md:ml-auto text-left md:text-right mt-2 md:mt-0">
                    <p className="font-bold text-lg text-gray-800">${itemTotal.toFixed(2)}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full flex-shrink-0 ${order.status === 'delivered' || order.status === 'Delivered' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">
                {order.status === 'delivered' || order.status === 'Delivered' ? 'បានបញ្ជូនដោយជោគជ័យ' : 'មិនទាន់បានបញ្ជូន'}
              </span>
            </div>
            <div className="font-bold text-gray-800">
              សរុប៖ ${calculatedTotal.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderDetail;
