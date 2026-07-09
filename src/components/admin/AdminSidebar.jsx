import { NavLink } from 'react-router-dom';
import { FiHome, FiPackage, FiLayers, FiShoppingBag, FiUsers, FiTag, FiImage, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const AdminSidebar = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
      isActive ? 'bg-[#25398C] text-white' : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-[#25398C]">Admin Panel</h2>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <NavLink to="/admin" end className={linkClass}>
          <FiHome /> Dashboard
        </NavLink>
        <NavLink to="/admin/products" className={linkClass}>
          <FiPackage /> Products
        </NavLink>
        <NavLink to="/admin/categories" className={linkClass}>
          <FiLayers /> Categories
        </NavLink>
        <NavLink to="/admin/orders" className={linkClass}>
          <FiShoppingBag /> Orders
        </NavLink>
        <NavLink to="/admin/users" className={linkClass}>
          <FiUsers /> Users
        </NavLink>
        <NavLink to="/admin/coupons" className={linkClass}>
          <FiTag /> Coupons
        </NavLink>
        <NavLink to="/admin/banners" className={linkClass}>
          <FiImage /> Banners
        </NavLink>
      </nav>
      <div className="p-4 border-t border-gray-100">
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition w-full">
          <FiLogOut /> Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
