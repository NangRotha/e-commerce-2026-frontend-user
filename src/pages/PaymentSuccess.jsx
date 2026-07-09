import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiHome, FiShoppingBag } from 'react-icons/fi';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  // Extract transaction_id from URL query params
  const queryParams = new URLSearchParams(location.search);
  const transactionId = queryParams.get('transaction_id') || 'N/A';
  const amount = queryParams.get('amount') || '0.00';

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center animate-fade-in-up">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiCheckCircle className="text-5xl text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">ការទូទាត់ជោគជ័យ!</h1>
        <p className="text-gray-500 mb-4">សូមអរគុណចំពោះការទិញទំនិញរបស់អ្នក</p>
        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
          <div className="flex justify-between text-sm py-1">
            <span className="text-gray-500">លេខប្រតិបត្តិការ</span>
            <span className="font-medium">{transactionId}</span>
          </div>
          <div className="flex justify-between text-sm py-1">
            <span className="text-gray-500">ចំនួនទឹកប្រាក់</span>
            <span className="font-medium text-green-600">${amount}</span>
          </div>
        </div>
        <div className="space-y-3">
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