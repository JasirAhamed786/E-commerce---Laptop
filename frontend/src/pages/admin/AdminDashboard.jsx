import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, Users, Package, TrendingUp, TrendingDown } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    userCount: 0,
    productCount: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [ordersRes, usersRes, productsRes] = await Promise.all([
          fetch('http://localhost:5000/api/orders/admin', { headers }),
          fetch('http://localhost:5000/api/users', { headers }),
          fetch('http://localhost:5000/api/products'),
        ]);

        const orders = await ordersRes.json();
        const users = await usersRes.json();
        const products = await productsRes.json();

        const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);

        setStats({
          totalSales,
          totalOrders: orders.length,
          userCount: users.length,
          productCount: products.length,
        });

        // Get recent 5 orders
        const sortedOrders = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentOrders(sortedOrders.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: 'Total Sales',
      value: `$${stats.totalSales.toFixed(2)}`,
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-gradient-to-r from-green-50 to-green-100',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-gradient-to-r from-blue-50 to-blue-100',
      trend: '+8%',
      trendUp: true,
    },
    {
      title: 'User Count',
      value: stats.userCount,
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-gradient-to-r from-purple-50 to-purple-100',
      trend: '+15%',
      trendUp: true,
    },
    {
      title: 'Product Count',
      value: stats.productCount,
      icon: Package,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-gradient-to-r from-orange-50 to-orange-100',
      trend: '+5%',
      trendUp: true,
    },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className={`${card.bgColor} rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{card.value}</p>
                  <div className="flex items-center text-sm">
                    {card.trendUp ? (
                      <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                    )}
                    <span className={card.trendUp ? 'text-green-600' : 'text-red-600'}>
                      {card.trend} from last month
                    </span>
                  </div>
                </div>
                <div className={`p-4 rounded-full bg-gradient-to-r ${card.color} text-white shadow-lg`}>
                  <Icon className="h-8 w-8" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order._id.slice(-8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${order.totalPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'Delivered'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'Shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status || 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {recentOrders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No orders yet
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
