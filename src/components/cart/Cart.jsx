import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

// Must match the backend address (same as api.js)
const BASE_URL = 'http://127.0.0.1:8000';

const getFullImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=200&q=80';

const Cart = () => {
  const { isAuthenticated } = useAuth();
  const { cart, cartCount } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link to="/cart" className="relative p-2.5 hover:bg-white/60 rounded-full transition-all duration-300 hover:shadow-md block">
        <svg className="text-xl text-gray-600 transition-colors duration-300 hover:text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {cartCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-[#3B82F6] text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold border-2 border-white animate-pulse shadow-sm">
            {cartCount}
          </span>
        )}
      </Link>

      {open && isAuthenticated && (
        <div className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 z-50 overflow-hidden animate-fadeInUp">
          <div className="px-4 py-3 border-b border-gray-100 font-semibold text-gray-800">
            កន្ទ្រក ({cartCount})
          </div>
          {cart.items.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-gray-500">
              កន្ទ្រករបស់អ្នកទទេ
            </div>
          ) : (
            <div className="max-h-72 overflow-y-auto">
              {cart.items.map((item) => (
                <Link
                  key={item.id}
                  to={`/product/${item.product_id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#3B82F6]/5 transition-colors duration-200 border-b border-gray-50 last:border-0"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={getFullImageUrl(item.product_image) || FALLBACK_IMG}
                      alt={item.product_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_IMG;
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.product_name}</p>
                    <p className="text-xs text-gray-500">x{item.quantity} · ${(item.subtotal ?? (item.product_price * item.quantity)).toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-100">
            <span className="text-sm text-gray-600">សរុប: <span className="font-bold text-gray-800">${(cart.total || 0).toFixed(2)}</span></span>
            <Link to="/cart" className="bg-[#3B82F6] text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-600 transition shadow-md">
              មើលកន្ទ្រក
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
