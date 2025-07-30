import React, { useEffect, useState } from 'react';
import fetchApi from '../api/fetchApi';
import './Orders.css';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      // Try admin endpoint first
      let data = await fetchApi('/api/orders/admin');
      if (!Array.isArray(data) && data.orders) data = data.orders;
      if (!Array.isArray(data)) {
        // fallback to user endpoint
        data = await fetchApi('/api/orders/');
        data = Array.isArray(data) ? data : data.orders || [];
      }
      setOrders(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch orders');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await fetchApi(`/api/orders/${orderId}`, { method: 'DELETE' });
      setOrders(orders.filter(order => order.id !== orderId));
    } catch (err) {
      setError(err.message || 'Failed to delete order');
    }
  };

  return (
    <div className="orders-page">
      <h2>Orders</h2>
      {error && <div className="error">{error}</div>}
      {loading ? <div>Loading...</div> : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User ID</th>
              <th>Status</th>
              <th>Total</th>
              <th>Created At</th>
              <th>Action</th>
              {/* <th>Location</th> (to be implemented later) */}
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user_id}</td>
                <td>{order.status}</td>
                <td>{order.total}</td>
                <td>{order.created_at}</td>
                <td>
                  <button onClick={() => handleDelete(order.id)} style={{color: 'red'}}>Delete</button>
                </td>
                {/* <td>{order.location}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Orders;
