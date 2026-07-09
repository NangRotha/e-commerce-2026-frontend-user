import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
const BASE_URL = API_URL.replace('/api', '');

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

function rewriteImageUrls(data) {
  if (Array.isArray(data)) {
    return data.map(rewriteImageUrls);
  }
  if (data && typeof data === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(data)) {
      if (key === 'image_url' && typeof value === 'string' && value.startsWith('/uploads/')) {
        result[key] = `${BASE_URL}${value}`;
      } else if (typeof value === 'object' && value !== null) {
        result[key] = rewriteImageUrls(value);
      } else {
        result[key] = value;
      }
    }
    return result;
  }
  return data;
}

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    response.data = rewriteImageUrls(response.data);
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ================== AUTH ==================
export const authAPI = {
  register: (data) => api.post('/register', data),
  login: ({ username, password }) => {
    const params = new URLSearchParams({ username, password });
    return api.post('/login', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  },
  getProfile: () => api.get('/users/me'),
  changePassword: (oldPassword, newPassword) => 
    api.post('/change-password', { old_password: oldPassword, new_password: newPassword }),
};

// ================== PRODUCTS & CATEGORIES ==================
export const productAPI = {
  getAll: (params = {}) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  search: (q) => api.get('/products/search', { params: { q } }),
};

export const categoryAPI = {
  getAll: () => api.get('/categories'),
};

// ================== CART & ORDERS ==================
export const cartAPI = {
  get: () => api.get('/cart'),
  add: (data) => api.post('/cart', data),
  update: (itemId, quantity) => api.put(`/cart/items/${itemId}`, { quantity }),
  remove: (itemId) => api.delete(`/cart/items/${itemId}`),
  clear: () => api.delete('/cart'),
};

export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

// ================== REVIEWS & WISHLIST ==================
export const reviewAPI = {
  create: (data) => api.post('/reviews', data),
  getByProduct: (productId) => api.get(`/reviews/product/${productId}`),
};

export const wishlistAPI = {
  get: () => api.get('/wishlist'),
  add: (data) => api.post('/wishlist', data),
  remove: (id) => api.delete(`/wishlist/${id}`),
};

// ================== KHQR PAYMENT ==================
export const khqrAPI = {
  // 🚨 មុខងារចាស់ (លែងប្រើ)
  create: (data) => api.post('/khqr/create', data),
  verify: (data) => api.post('/khqr/verify', data),
  // 🚨 មុខងារថ្មីដែលត្រូវប្រើសម្រាប់ Redirect
  createRedirect: (orderId, amount) => 
    api.get(`/khqr/create-redirect/${orderId}?amount=${amount}`),
};

// ================== BANNERS & SETTINGS ==================
export const bannerAPI = {
  getAll: () => api.get('/banners'),
};

export const settingsAPI = {
  getNavbar: () => api.get('/settings/navbar'),
  getFooter: () => api.get('/settings/footer'),
};

// ================== ADMIN APIs ==================
const adminApi = axios.create({
  baseURL: `${API_URL}/admin`,
  headers: { 'Content-Type': 'application/json' },
});

adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export const adminAPI = {
  dashboard: () => adminApi.get('/dashboard'),

  products: {
    getAll: () => adminApi.get('/products'),
    getById: (id) => adminApi.get(`/products/${id}`),
    create: (data) => adminApi.post('/products', data),
    update: (id, data) => adminApi.put(`/products/${id}`, data),
    delete: (id) => adminApi.delete(`/products/${id}`),
    uploadImage: (id, file) => {
      const form = new FormData();
      form.append('file', file);
      return adminApi.post(`/products/${id}/images`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    uploadMultipleImages: (id, files) => {
      const form = new FormData();
      files.forEach((f) => form.append('files', f));
      return adminApi.post(`/products/${id}/images/multiple`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
  },

  categories: {
    getAll: () => adminApi.get('/categories'),
    create: (data) => adminApi.post('/categories', data),
    update: (id, data) => adminApi.put(`/categories/${id}`, data),
    delete: (id) => adminApi.delete(`/categories/${id}`),
    uploadImage: (id, file) => {
      const form = new FormData();
      form.append('file', file);
      return adminApi.post(`/categories/${id}/images`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
  },

  orders: {
    getAll: (params = {}) => adminApi.get('/orders', { params }),
    updateStatus: (id, status) => adminApi.put(`/orders/${id}/status`, { status }),
  },

  users: {
    getAll: () => adminApi.get('/users'),
    block: (id) => adminApi.put(`/users/${id}/block`),
  },

  coupons: {
    getAll: () => adminApi.get('/coupons'),
    create: (data) => adminApi.post('/coupons', data),
    delete: (id) => adminApi.delete(`/coupons/${id}`),
  },

  banners: {
    getAll: () => adminApi.get('/banners'),
    create: (data) => adminApi.post('/banners', data),
    update: (id, data) => adminApi.put(`/banners/${id}`, data),
    delete: (id) => adminApi.delete(`/banners/${id}`),
    toggle: (id) => adminApi.put(`/banners/${id}/toggle`),
    uploadImage: (id, file) => {
      const form = new FormData();
      form.append('file', file);
      return adminApi.post(`/banners/${id}/images`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
  },
};

// Export adminApi instance (optional)
export { adminApi };

export default api;