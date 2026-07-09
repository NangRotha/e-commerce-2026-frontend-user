import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await adminAPI.dashboard();
      setStats(res.data);
    } catch (error) {
      console.error('Error loading dashboard', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  if (!stats) {
    return <div className="p-6 text-red-500">Failed to load dashboard data.</div>;
  }

  const cards = [
    { label: 'Total Sales', value: `$${stats.total_sales?.toFixed(2) || '0.00'}`, color: 'bg-green-50 text-green-700' },
    { label: 'Total Orders', value: stats.total_orders || 0, color: 'bg-blue-50 text-blue-700' },
    { label: 'Total Products', value: stats.total_products || 0, color: 'bg-purple-50 text-purple-700' },
    { label: 'Total Users', value: stats.total_users || 0, color: 'bg-yellow-50 text-yellow-700' },
    { label: 'Monthly Revenue', value: `$${stats.monthly_revenue?.toFixed(2) || '0.00'}`, color: 'bg-pink-50 text-pink-700' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map((card, idx) => (
          <div key={idx} className={`p-5 rounded-xl shadow-sm border border-gray-100 ${card.color}`}>
            <p className="text-sm font-medium opacity-80">{card.label}</p>
            <p className="text-2xl font-bold mt-2">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
