import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders/myorders', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status, isCancelled) => {
    if (isCancelled) return 'bg-red-100 text-red-800';
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRefundBadge = (refundStatus) => {
    switch (refundStatus) {
      case 'processed':
        return <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Refund Processed</span>;
      case 'pending':
        return <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">Refund Pending</span>;
      case 'rejected':
        return <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">Refund Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
              <p className="text-gray-600 mt-1">Track and manage your order history</p>
            </div>
            <Link
              to="/shop"
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* Orders Content */}
      <div className="container mx-auto px-4 py-8">
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping to see your orders here.</p>
            <Link
              to="/shop"
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow ${order.isCancelled ? 'border-red-200' : ''}`}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Order #{order._id.substring(0, 8)}</p>
                      <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${order.isCancelled ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                        ₹{order.totalPrice.toLocaleString('en-IN')}
                      </p>
                      {order.isCancelled && order.refundAmount > 0 && (
                        <p className="text-lg font-bold text-green-600">
                          Refund: ₹{order.refundAmount.toLocaleString('en-IN')}
                        </p>
                      )}
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status, order.isCancelled)}`}>
                          {order.isCancelled ? 'Cancelled' : order.status}
                        </span>
                        {getRefundBadge(order.refundStatus)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex -space-x-2">
                        {order.orderItems.slice(0, 3).map((item, index) => (
                          <div key={index} className="w-10 h-10 bg-gray-200 rounded-lg border-2 border-white overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/40x40?text=No+Image';
                              }}
                            />
                          </div>
                        ))}
                        {order.orderItems.length > 3 && (
                          <div className="w-10 h-10 bg-gray-100 rounded-lg border-2 border-white flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">+{order.orderItems.length - 3}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {order.orderItems.length} item{order.orderItems.length > 1 ? 's' : ''}
                        </p>
                        {order.cancellationReason && (
                          <p className="text-xs text-gray-500 mt-1">
                            Reason: {order.cancellationReason}
                          </p>
                        )}
                      </div>
                    </div>

                    <Link
                      to={`/orders/${order._id}`}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-semibold text-sm transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
