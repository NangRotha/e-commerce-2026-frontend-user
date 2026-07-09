import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiHome, FiShoppingBag, FiLoader, FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';
import { orderAPI } from '../services/api';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const [transactionId, setTransactionId] = useState('N/A');
  const [amount, setAmount] = useState('0.00');
  const [loading, setLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState(null);
  const [orderId, setOrderId] = useState(null);

  const queryParams = new URLSearchParams(location.search);
  const urlTransactionId = queryParams.get('transaction_id');
  const urlAmount = queryParams.get('amount');

  useEffect(() => {
    const loadOrderInfo = async () => {
      try {
        let storedOrderId = sessionStorage.getItem('last_order_id');
        
        if (urlTransactionId) {
          const extractedId = urlTransactionId.replace('KHQR_', '');
          setTransactionId(urlTransactionId);
          setAmount(urlAmount || '0.00');
          storedOrderId = extractedId;
        } else if (storedOrderId) {
          setTransactionId(storedOrderId);
        }

        if (storedOrderId) {
          try {
            const response = await orderAPI.getById(storedOrderId);
            const orderData = response.data;
            setOrderId(orderData.id);
            setTransactionId(orderData.id || transactionId);
            setAmount(orderData.total_price?.toFixed(2) || amount);
            setOrderStatus(orderData.status || 'pending');
          } catch (error) {
            console.error('Failed to fetch order status:', error);
            setOrderStatus('unknown');
          }
        } else {
          setOrderStatus('unknown');
        }
      } catch (error) {
        console.error('Failed to load order info:', error);
        setOrderStatus('unknown');
      } finally {
        setLoading(false);
      }
    };

    loadOrderInfo();
  }, [urlTransactionId, urlAmount]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/orders');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  const handleRetryPayment = () => {
    if (orderId) {
      navigate(`/checkout?retry=${orderId}`);
    } else {
      navigate('/checkout');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center">
          <div className="w-16 h-16 border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">កំពុងផ្ទុកព័ត៌មានការបញ្ជាទិញ...</p>
        </div>
      </div>
    );
  }

  const isPaid = orderStatus === 'paid';
  const isPending = orderStatus === 'pending' || orderStatus === null;
  const isUnknown = orderStatus === 'unknown';

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center animate-fade-in-up">
        {isPaid ? (
          <>
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheckCircle className="text-5xl text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">ការទូទាត់ជោគជ័យ!</h1>
            <p className="text-gray-500 mb-4">សូមអរគុណចំពោះការទិញទំនិញរបស់អ្នក</p>
          </>
        ) : isPending ? (
          <>
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiAlertTriangle className="text-5xl text-yellow-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">ការទូទាត់មិនទាន់បញ្ចប់</h1>
            <p className="text-gray-500 mb-4">សESSION ទូទាត់របស់អ្នកត្រូវបានផុតកំណត់ ឬការទូទាត់មិនទាន់បញ្ចប់</p>
          </>
        ) : (
          <>
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiAlertTriangle className="text-5xl text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">មិនអាចផ្ទុកព័ត៌មានការបញ្ជាទិញបាន</h1>
            <p className="text-gray-500 mb-4">សូមព្យាយាមម្តងទៀត ឬទាក់ទងសេវាជំនួយ</p>
          </>
        )}

        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
          <div className="flex justify-between text-sm py-1">
            <span className="text-gray-500">លេខប្រតិបត្តិការ</span>
            <span className="font-medium">{transactionId}</span>
          </div>
          <div className="flex justify-between text-sm py-1">
            <span className="text-gray-500">ចំនួនទឹកប្រាក់</span>
            <span className={`font-medium ${isPaid ? 'text-green-600' : 'text-gray-800'}`}>${amount}</span>
          </div>
          {orderStatus && (
            <div className="flex justify-between text-sm py-1">
              <span className="text-gray-500">ស្ថានភាព</span>
              <span className={`font-medium capitalize ${
                isPaid ? 'text-green-600' : 
                isPending ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {orderStatus === 'paid' ? 'បានទូទាត់' : 
                 orderStatus === 'pending' ? 'កំពុងរង់ចាំ' : 
                 orderStatus === 'unknown' ? 'មិនស្គាល់' : orderStatus}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {!isPaid && (
            <button 
              onClick={handleRetryPayment}
              className="w-full bg-[#3B82F6] text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <FiRefreshCw /> ព្យាយាមទូទាត់ម្តងទៀត
            </button>
          )}
          <Link 
            to="/orders" 
            className="w-full bg-[#25398C] text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <FiShoppingBag /> មើលការបញ្ជាទិញ
          </Link>
          <Link 
            to="/" 
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
          >
            <FiHome /> ត្រឡប់ទៅទំព័រដើម
          </Link>
        </div>
        <p className="text-xs text-gray-400 mt-6">
          នឹងប្តូរទៅទំព័រការបញ្ជាទិញដោយស្វ័យប្រវត្តិក្នុងរយៈពេល {countdown} វិនាទី...
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
