import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './components/products/ProductDetail';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/user/Profile';
import Orders from './components/user/Orders';
import OrderDetail from './components/user/OrderDetail';
import Wishlist from './components/user/Wishlist';
import AdminSidebar from './components/admin/AdminSidebar';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminBanners from './pages/admin/AdminBanners';
import NotFound from './pages/NotFound';
import PaymentSuccess from './pages/PaymentSuccess'; // 🚨 បន្ថែមការនាំចូលនេះ!

function App() {
  const { isAuthenticated, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F8F9FA]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#1E3A8A] mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">កំពុងផ្ទុក...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] font-sans">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* ========== PUBLIC & USER ROUTES ========== */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/payment-success" element={<PaymentSuccess />} /> {/* 🚨 បន្ថែម Route នេះ! */}

          {/* AUTH ROUTES */}
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/" /> : <Login />
          } />
          <Route path="/register" element={
            isAuthenticated ? <Navigate to="/" /> : <Register />
          } />

          {/* PROTECTED USER ROUTES */}
          <Route path="/checkout" element={
            isAuthenticated ? <Checkout /> : <Navigate to="/login" />
          } />
          <Route path="/profile" element={
            isAuthenticated ? <Profile /> : <Navigate to="/login" />
          } />
          <Route path="/orders" element={
            isAuthenticated ? <Orders /> : <Navigate to="/login" />
          } />
          <Route path="/orders/:id" element={
            isAuthenticated ? <OrderDetail /> : <Navigate to="/login" />
          } />
          <Route path="/wishlist" element={
            isAuthenticated ? <Wishlist /> : <Navigate to="/login" />
          } />

          {/* ========== ADMIN ROUTES (Reusable Layout) ========== */}
          {/* Admin Layout Wrapper */}
          <Route path="/admin" element={
            isAdmin ? (
              <div className="flex min-h-screen bg-gray-50">
                <AdminSidebar />
                <div className="flex-1 p-6 overflow-auto">
                  <Outlet />
                </div>
              </div>
            ) : <Navigate to="/" />
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="banners" element={<AdminBanners />} />
          </Route>

          {/* ========== 404 NOT FOUND ========== */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;