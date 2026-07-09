import { useState, useEffect } from 'react';
import { createCheckoutSession, verifyPayment } from '../../services/paymentService';
import { QRCodeSVG } from 'qrcode.react';
import { FiX, FiCheckCircle, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';

const KHQRPaymentModal = ({ isOpen, onClose, orderId, amount, onSuccess }) => {
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, generating, paid, error
  const [pollInterval, setPollInterval] = useState(null);

  // Generate payment session when modal opens
  useEffect(() => {
    if (isOpen && !qrData) {
      generatePayment();
    }
    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [isOpen]);

  const generatePayment = async () => {
    setLoading(true);
    setStatus('generating');
    const successUrl = `${window.location.origin}/payment-success`;
    
    const result = await createCheckoutSession(orderId, amount, successUrl, `Order #${orderId}`);
    
    if (result.success) {
      setQrData(result);
      setStatus('waiting');
      startPolling(result.transactionId);
    } else {
      setStatus('error');
      toast.error(result.message || 'Failed to generate QR code');
    }
    setLoading(false);
  };

  const startPolling = (transactionId) => {
    // Poll every 3 seconds to check if payment is complete
    const interval = setInterval(async () => {
      const result = await verifyPayment(transactionId);
      if (result.success) {
        clearInterval(interval);
        setPollInterval(null);
        setStatus('paid');
        toast.success('Payment received successfully!');
        if (onSuccess) onSuccess(result.data);
      }
    }, 3000);
    setPollInterval(interval);
  };

  const handleClose = () => {
    if (pollInterval) clearInterval(pollInterval);
    setStatus('idle');
    setQrData(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 relative animate-fade-in-up">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <FiX className="text-2xl" />
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">KHQR Payment</h2>
          <p className="text-gray-500 text-sm mb-6">Scan with your Bakong / ABA app</p>
        </div>

        {/* QR Code Display */}
        <div className="flex flex-col items-center justify-center py-4">
          {status === 'generating' && (
            <div className="flex flex-col items-center gap-4">
              <FiLoader className="text-5xl text-[#25398C] animate-spin" />
              <p className="text-gray-500 text-sm">Generating secure QR code...</p>
            </div>
          )}

          {status === 'waiting' && qrData && (
            <div className="flex flex-col items-center gap-4">
              <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-200">
                <QRCodeSVG 
                  value={qrData.qrRaw} 
                  size={200} 
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="H"
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-700">
                  Amount: <span className="text-[#25398C]">${amount.toFixed(2)}</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">Waiting for payment...</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-[#25398C] h-1.5 rounded-full animate-pulse w-full"></div>
                </div>
              </div>
            </div>
          )}

          {status === 'paid' && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <FiCheckCircle className="text-5xl text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Payment Successful!</h3>
              <p className="text-gray-500 text-sm">Your order has been confirmed.</p>
            </div>
          )}

          {status === 'error' && (
            <div className="py-8 text-center">
              <div className="text-red-500 text-4xl mb-2">⚠️</div>
              <h3 className="text-xl font-bold text-gray-800">Payment Failed</h3>
              <p className="text-gray-500 text-sm">Please try again or contact support.</p>
              <button 
                onClick={generatePayment}
                className="mt-4 bg-[#25398C] text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition"
              >
                Retry
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            Powered by <span className="font-semibold">KHQR Gateway</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default KHQRPaymentModal;