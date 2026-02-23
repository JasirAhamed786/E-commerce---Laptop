import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showItemCancelModal, setShowItemCancelModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        setOrder(data);
        
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.get('cancel') === 'true') {
          setTimeout(() => {
            if (data && !data.isCancelled && data.status !== 'Delivered' && data.status !== 'Shipped') {
              setShowCancelModal(true);
            }
          }, 500);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, location.search]);

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }

    setCancelling(true);
    try {
      const response = await fetch(`/api/orders/${id}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ reason: cancelReason }),
      });

      const data = await response.json();

      if (response.ok) {
        setOrder(data);
        setShowCancelModal(false);
        toast.success('Order cancelled successfully');
      } else {
        toast.error(data.message || 'Failed to cancel order');
      }
    } catch (error) {
      toast.error('Error cancelling order');
    } finally {
      setCancelling(false);
    }
  };

  const handleCancelItem = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }

    setCancelling(true);
    try {
      const response = await fetch(`/api/orders/${id}/item/${selectedItem._id}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ reason: cancelReason }),
      });

      const data = await response.json();

      if (response.ok) {
        setOrder(data);
        setShowItemCancelModal(false);
        setSelectedItem(null);
        toast.success('Item cancelled successfully');
      } else {
        toast.error(data.message || 'Failed to cancel item');
      }
    } catch (error) {
      toast.error('Error cancelling item');
    } finally {
      setCancelling(false);
    }
  };

  const openItemCancelModal = (item) => {
    setSelectedItem(item);
    setShowItemCancelModal(true);
  };

  const canCancelOrder = () => {
    if (!order) return false;
    if (order.isCancelled) return false;
    if (order.status === 'Delivered') return false;
    if (order.status === 'Shipped') return false;
    return true;
  };

  const canCancelItem = (item) => {
    if (!order) return false;
    if (order.isCancelled) return false;
    if (order.status === 'Delivered') return false;
    if (order.status === 'Shipped') return false;
    if (item.isCancelled) return false;
    return true;
  };

  const getStatusProgress = (status) => {
    if (status === 'Cancelled') return 0;
    switch (status) {
      case 'Processing': return 33;
      case 'Shipped': return 66;
      case 'Delivered': return 100;
      default: return 0;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Cancelled': return 'text-red-600 bg-red-100';
      case 'Delivered': return 'text-green-600 bg-green-100';
      case 'Shipped': return 'text-blue-600 bg-blue-100';
      case 'Processing': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRefundStatusColor = (status) => {
    switch (status) {
      case 'processed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.203-2.47C6.78 11.009 8.73 10 11.07 10c2.34 0 4.29 1.009 5.203 2.47z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Order not found</h3>
          <Link to="/orders" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
              <p className="text-gray-600 mt-1">Order #{order._id.substring(0, 8)}</p>
            </div>
            <div className="flex space-x-3">
              {canCancelOrder() && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="bg-red-100 hover:bg-red-200 text-red-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Cancel Order
                </button>
              )}
              <Link to="/orders" className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors">
                Back to Orders
              </Link>
              <Link to="/shop" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Order Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Status & Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Status Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Status</h2>
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-3">
                  <span>Processing</span>
                  <span>Shipped</span>
                  <span>Delivered</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${order.status === 'Cancelled' ? 'bg-red-500' : 'bg-orange-500'}`}
                    style={{ width: `${getStatusProgress(order.status)}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-900">Status</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>

            {/* Refund Status Card */}
            {order.isCancelled && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Refund Status</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Refund Status</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRefundStatusColor(order.refundStatus)}`}>
                      {order.refundStatus === 'none' ? 'Not Applicable' : order.refundStatus.charAt(0).toUpperCase() + order.refundStatus.slice(1)}
                    </span>
                  </div>
                  {order.refundAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Refund Amount</span>
                      <span className="font-medium text-green-600">₹{order.refundAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {order.cancellationReason && (
                    <div className="mt-4 pt-4 border-t">
                      <span className="text-gray-600 block mb-2">Cancellation Reason:</span>
                      <p className="text-gray-900 text-sm">{order.cancellationReason}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Order Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date</span>
                  <span className="font-medium">{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID</span>
                  <span className="font-medium font-mono text-sm">{order._id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Items</span>
                  <span className="font-medium">{order.orderItems.filter(i => !i.isCancelled).length} / {order.orderItems.length}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
              <div className="text-gray-700">
                <p className="font-medium">{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Items</h2>
              <div className="space-y-4">
                {order.orderItems.map((item) => (
                  <div key={item._id} className={`flex items-center space-x-4 p-4 rounded-lg ${item.isCancelled ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-200'}`}>
                    <div className="w-20 h-20 bg-white rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/80x80?text=No+Image'; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-semibold text-gray-900 truncate">{item.name}</h4>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-gray-600">Qty: {item.qty}</span>
                        <span className="text-gray-600">₹{item.price.toLocaleString('en-IN')}</span>
                      </div>
                      {item.isCancelled && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">Cancelled</span>
                          {item.refundStatus !== 'none' && (
                            <span className={`px-2 py-1 text-xs font-medium rounded ${getRefundStatusColor(item.refundStatus)}`}>
                              Refund: {item.refundStatus}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-bold ${item.isCancelled ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                        ₹{(item.price * item.qty).toLocaleString('en-IN')}
                      </p>
                      {item.isCancelled && item.refundAmount > 0 && (
                        <p className="text-sm font-bold text-green-600">
                          Refund: ₹{item.refundAmount.toLocaleString('en-IN')}
                        </p>
                      )}
                      {!order.isCancelled && order.status !== 'Delivered' && order.status !== 'Shipped' && !item.isCancelled && (
                        <button
                          onClick={() => openItemCancelModal(item)}
                          className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          Cancel Item
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Total */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-semibold text-gray-900">Total Amount</span>
                  <span className={`text-3xl font-bold ${order.isCancelled ? 'text-red-600 line-through' : 'text-orange-600'}`}>
                    ₹{order.totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                {order.isCancelled && (
                  <div className="mt-2 text-right">
                    <span className="text-xl font-bold text-green-600">
                      Refund: ₹{order.refundAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Cancel Order</h3>
            <p className="text-gray-600 mb-4">Are you sure you want to cancel this order? This action cannot be undone.</p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason for cancellation *</label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                rows="3"
                placeholder="Please provide a reason for cancellation..."
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => { setShowCancelModal(false); setCancelReason(''); }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Item Modal */}
      {showItemCancelModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Cancel Item</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel <strong>{selectedItem.name}</strong>? 
              This will refund ₹{(selectedItem.price * selectedItem.qty).toLocaleString('en-IN')}.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason for cancellation *</label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                rows="3"
                placeholder="Please provide a reason for cancellation..."
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => { setShowItemCancelModal(false); setSelectedItem(null); setCancelReason(''); }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Keep Item
              </button>
              <button
                onClick={handleCancelItem}
                disabled={cancelling}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;
