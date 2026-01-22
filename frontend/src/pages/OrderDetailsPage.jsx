import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return <div className="text-center py-8">Loading order details...</div>;
  }

  if (!order) {
    return <div className="text-center py-8">Order not found.</div>;
  }

  const getStatusProgress = (status) => {
    switch (status) {
      case 'Processing':
        return 33;
      case 'Shipped':
        return 66;
      case 'Delivered':
        return 100;
      default:
        return 0;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order Details</h1>
      <div className="bg-white shadow-md rounded p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Status</h2>
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Processing</span>
            <span>Shipped</span>
            <span>Delivered</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-orange-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${getStatusProgress(order.status)}%` }}
            ></div>
          </div>
        </div>
        <p className="text-lg font-medium">Status: {order.status}</p>
      </div>
      <div className="bg-white shadow-md rounded p-6">
        <h2 className="text-xl font-semibold mb-4">Order Items</h2>
        <div className="space-y-4">
          {order.orderItems.map((item) => (
            <div key={item._id} className="flex items-center space-x-4 border-b pb-4">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">Quantity: {item.qty}</p>
                <p className="text-gray-600">Price: ₹{item.price}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">₹{item.price * item.qty}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total:</span>
            <span>₹{order.totalPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
