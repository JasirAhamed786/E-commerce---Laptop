import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, DollarSign, Package, Eye, RefreshCw, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showItemRefundModal, setShowItemRefundModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [refundAction, setRefundAction] = useState('process');
  const [rejectReason, setRejectReason] = useState('');
  const [expandedOrders, setExpandedOrders] = useState([]);
  const ordersPerPage = 10;

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/orders/admin', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      console.error('Fetch orders error:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = orders.filter(order => {
      const userName = order.user?.name || '';
      const orderId = order._id || '';
      return userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             orderId.toLowerCase().includes(searchTerm.toLowerCase());
    });

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => (order.status || 'Pending') === statusFilter);
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, orders]);

  const handleRefundAction = async () => {
    if (refundAction === 'reject' && !rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/orders/${selectedOrder._id}/refund`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: refundAction, rejectReason }),
      });

      if (response.ok) {
        toast.success(refundAction === 'process' ? 'Refund processed successfully' : 'Refund rejected');
        setShowRefundModal(false);
        setSelectedOrder(null);
        setRejectReason('');
        fetchOrders();
      } else {
        toast.error('Failed to process refund');
      }
    } catch (error) {
      toast.error('Error processing refund');
    }
  };

  const handleItemRefundAction = async () => {
    if (refundAction === 'reject' && !rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/orders/${selectedOrder._id}/item/${selectedItem._id}/refund`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: refundAction, rejectReason }),
      });

      if (response.ok) {
        toast.success(refundAction === 'process' ? 'Item refund processed successfully' : 'Item refund rejected');
        setShowItemRefundModal(false);
        setSelectedItem(null);
        setRejectReason('');
        fetchOrders();
      } else {
        toast.error('Failed to process item refund');
      }
    } catch (error) {
      toast.error('Error processing item refund');
    }
  };

  const openRefundModal = (order, action) => {
    setSelectedOrder(order);
    setRefundAction(action);
    setShowRefundModal(true);
  };

  const openItemRefundModal = (order, item, action) => {
    setSelectedOrder(order);
    setSelectedItem(item);
    setRefundAction(action);
    setShowItemRefundModal(true);
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        toast.success('Order status updated successfully');
        fetchOrders();
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      toast.error('Error updating status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRefundStatusColor = (status) => {
    switch (status) {
      case 'processed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate stats
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const pendingOrders = orders.filter(order => (order.status || 'Pending') === 'Pending').length;
  const cancelledOrders = orders.filter(order => order.isCancelled).length;
  const refundPendingOrders = orders.filter(order => order.refundStatus === 'pending').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-1">Track and manage customer orders</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl">
          <div className="flex items-center">
            <div className="p-3 bg-green-500 rounded-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl">
          <div className="flex items-center">
            <div className="p-3 bg-blue-500 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-xl">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-500 rounded-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-xl">
          <div className="flex items-center">
            <div className="p-3 bg-red-500 rounded-lg">
              <XCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-gray-900">{cancelledOrders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by order ID or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Refund Pending Alert */}
      {refundPendingOrders > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center">
            <RefreshCw className="h-5 w-5 text-yellow-600 mr-3" />
            <span className="text-yellow-800 font-medium">
              {refundPendingOrders} order(s) waiting for refund processing
            </span>
          </div>
          <button
            onClick={() => setStatusFilter('Cancelled')}
            className="text-yellow-700 hover:text-yellow-900 font-medium"
          >
            View
          </button>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                </th>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Refund
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentOrders.length > 0 ? (
                currentOrders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleOrderExpand(order._id)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          {expandedOrders.includes(order._id) ? (
                            <ChevronUp className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order._id.slice(-8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-700">
                              {order.user?.name?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{order.user?.name || 'Unknown'}</div>
                            <div className="text-sm text-gray-500">{order.user?.email || 'No email'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.createdAt ? formatDate(order.createdAt) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${order.totalPrice?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.status || 'Pending'}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          disabled={order.isCancelled}
                          className={`px-3 py-1 text-xs font-semibold rounded-full border-0 ${getStatusColor(order.status || 'Pending')} disabled:opacity-50`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.isCancelled ? (
                          <div className="flex items-center">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRefundStatusColor(order.refundStatus)}`}>
                              {order.refundStatus === 'none' ? 'N/A' : order.refundStatus}
                            </span>
                            {order.refundStatus === 'pending' && (
                              <div className="ml-2 flex space-x-1">
                                <button
                                  onClick={() => openRefundModal(order, 'process')}
                                  className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
                                  title="Process Refund"
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => openRefundModal(order, 'reject')}
                                  className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                                  title="Reject Refund"
                                >
                                  <XCircle className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.orderItems?.length || 0} items
                      </td>
                    </tr>
                    {/* Expanded Order Items */}
                    {expandedOrders.includes(order._id) && (
                      <tr>
                        <td colSpan="8" className="px-6 py-4 bg-gray-50">
                          <div className="ml-8">
                            <h4 className="text-sm font-semibold text-gray-900 mb-3">Order Items</h4>
                            <div className="space-y-2">
                              {order.orderItems?.map((item) => (
                                <div key={item._id} className={`flex items-center justify-between p-3 rounded-lg ${item.isCancelled ? 'bg-red-50 border border-red-200' : 'bg-white border border-gray-200'}`}>
                                  <div className="flex items-center space-x-3">
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-12 h-12 object-cover rounded"
                                      onError={(e) => { e.target.src = 'https://via.placeholder.com/48?text=No+Image'; }}
                                    />
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                      <p className="text-xs text-gray-500">Qty: {item.qty} × ₹{item.price}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-4">
                                    {item.isCancelled ? (
                                      <>
                                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">Cancelled</span>
                                        {item.refundStatus !== 'none' && (
                                          <span className={`px-2 py-1 text-xs font-medium rounded ${getRefundStatusColor(item.refundStatus)}`}>
                                            {item.refundStatus}
                                          </span>
                                        )}
                                        {item.refundStatus === 'pending' && (
                                          <div className="flex space-x-1">
                                            <button
                                              onClick={() => openItemRefundModal(order, item, 'process')}
                                              className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
                                              title="Process Item Refund"
                                            >
                                              <RefreshCw className="h-4 w-4" />
                                            </button>
                                            <button
                                              onClick={() => openItemRefundModal(order, item, 'reject')}
                                              className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                                              title="Reject Item Refund"
                                            >
                                              <XCircle className="h-4 w-4" />
                                            </button>
                                          </div>
                                        )}
                                        <span className="text-sm font-medium text-gray-500 line-through">
                                          ₹{(item.price * item.qty).toLocaleString('en-IN')}
                                        </span>
                                        {item.refundAmount > 0 && (
                                          <span className="text-sm font-bold text-green-600">
                                            Refund: ₹{item.refundAmount.toLocaleString('en-IN')}
                                          </span>
                                        )}
                                      </>
                                    ) : (
                                      <span className="text-sm font-medium text-gray-900">
                                        ₹{(item.price * item.qty).toLocaleString('en-IN')}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <Package className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                      <p className="text-gray-500">There are no orders to display at the moment.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} orders
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-3 py-1 text-sm border rounded-md ${
                    currentPage === number
                      ? 'bg-orange-600 text-white border-orange-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {number}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Refund Modal */}
      {showRefundModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {refundAction === 'process' ? 'Process Refund' : 'Reject Refund'}
            </h3>
            <div className="mb-4">
              <p className="text-gray-600 mb-2">Order: #{selectedOrder._id.slice(-8)}</p>
              <p className="text-gray-600 mb-2">Customer: {selectedOrder.user?.name}</p>
              <p className="text-lg font-semibold text-gray-900">
                Refund Amount: ₹{selectedOrder.refundAmount?.toLocaleString('en-IN') || selectedOrder.totalPrice.toLocaleString('en-IN')}
              </p>
            </div>
            {refundAction === 'reject' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for rejection *
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  rows="3"
                  placeholder="Please provide a reason for rejection..."
                />
              </div>
            )}
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowRefundModal(false);
                  setSelectedOrder(null);
                  setRejectReason('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRefundAction}
                className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                  refundAction === 'process' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {refundAction === 'process' ? 'Process Refund' : 'Reject Refund'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Item Refund Modal */}
      {showItemRefundModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {refundAction === 'process' ? 'Process Item Refund' : 'Reject Item Refund'}
            </h3>
            <div className="mb-4">
              <p className="text-gray-600 mb-2">Order: #{selectedOrder?._id?.slice(-8)}</p>
              <p className="text-gray-600 mb-2">Item: {selectedItem.name}</p>
              <p className="text-gray-600 mb-2">Qty: {selectedItem.qty} × ₹{selectedItem.price}</p>
              <p className="text-lg font-semibold text-gray-900">
                Refund Amount: ₹{selectedItem.refundAmount?.toLocaleString('en-IN') || (selectedItem.price * selectedItem.qty).toLocaleString('en-IN')}
              </p>
            </div>
            {refundAction === 'reject' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for rejection *
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  rows="3"
                  placeholder="Please provide a reason for rejection..."
                />
              </div>
            )}
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowItemRefundModal(false);
                  setSelectedItem(null);
                  setRejectReason('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleItemRefundAction}
                className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                  refundAction === 'process' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {refundAction === 'process' ? 'Process Refund' : 'Reject Refund'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
