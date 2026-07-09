import axios from 'axios';

// 🔑 YOUR CONFIGURATION (COPY FROM YOUR GATEWAY DASHBOARD)
const CONFIG = {
  profileId: 'qnPwHDAbNSIl7vOW30S8cfehCvDnPIMv', // Your Profile ID
  secretKey: 'cFqDsHU3ufZPqhwfak46juP1zblL8jT1', // Your Secret Key
  gatewayUrl: 'https://khqr.cc/api/payment/request',
  apiQrUrl: 'https://khqr.cc/api/qnPwHDAbNSIl7vOW30S8cfehCvDnPIMv/payment-gateway/v1/payments/qr-api-khqrcc',
  verifyUrl: 'https://khqr.cc/api/qnPwHDAbNSIl7vOW30S8cfehCvDnPIMv/payment-gateway/v1/payments/check-trans',
};

// Generate SHA1 Hash (Matches PHP sha1)
const generateHash = (secret, id, amt, url, remark) => {
  const rawString = secret + id + amt + url + remark;
  // Note: In a real production environment, this MUST be done on your Backend.
  // For demo purposes, we simulate it here. 
  // Since we cannot run SHA1 in pure JS without a library, we will use the Backend for hashing.
  // YOU MUST IMPLEMENT THIS ON YOUR BACKEND! (See Step 3)
  return rawString; 
};

// 🚨 CRITICAL: In production, you MUST generate the hash on your Backend (FastAPI)
// because the Secret Key must NEVER be exposed to the Frontend.
export const createCheckoutSession = async (orderId, amount, successUrl, remark = 'Order Payment') => {
  try {
    // In a real implementation, you should call your own Backend API here 
    // to generate the hash securely. For this demo, we pass data to the gateway.
    
    // 1. Prepare data
    const data = {
      transaction_id: orderId,
      amount: amount,
      success_url: successUrl,
      remark: remark,
    };

    // 2. Send request to KHQR API to get QR Data
    const response = await axios.post(CONFIG.apiQrUrl, data, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    if (response.data.responseCode === 0) {
      return {
        success: true,
        qrRaw: response.data.data.qr,
        qrImageUrl: response.data.data.qr_url,
        transactionId: response.data.data.transaction_id,
      };
    } else {
      return { success: false, message: response.data.responseMessage };
    }
  } catch (error) {
    console.error('Payment session creation failed:', error);
    return { success: false, message: 'Failed to create payment session' };
  }
};

// Verify Payment Status (Polling)
export const verifyPayment = async (transactionId) => {
  try {
    const response = await axios.post(CONFIG.verifyUrl, {
      transaction_id: transactionId,
      // In production, generate this hash on your backend using profile_key + transaction_id
      // hash: sha1(profile_key + transaction_id)
    }, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    if (response.data.responseCode === 0 && response.data.data.status?.toLowerCase() === 'success') {
      return { success: true, data: response.data.data };
    }
    return { success: false };
  } catch (error) {
    return { success: false };
  }
};