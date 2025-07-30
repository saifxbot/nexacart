import React, { useEffect, useState } from 'react';
import fetchApi from '../api/fetchApi';
import './Cart.css';

function Cart() {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCarts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchApi('/api/cart/admin');
      setCarts(Array.isArray(data) ? data : data.carts || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch carts');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCarts();
  }, []);

  return (
    <div className="cart-page">
      <h2>User Carts</h2>
      {error && <div className="error">{error}</div>}
      {loading ? <div>Loading...</div> : (
        <table className="cart-table">
          <thead>
            <tr>
              <th>Cart ID</th>
              <th>User ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            {carts.map(cart => (
              <tr key={cart.id}>
                <td>{cart.id}</td>
                <td>{cart.user_id}</td>
                <td>{cart.user?.first_name || ''}</td>
                <td>{cart.user?.last_name || ''}</td>
                <td>
                  {cart.items && cart.items.length > 0 ? (
                    <ul>
                      {cart.items.map(item => (
                        <li key={item.id}>
                          Product: {item.product?.name || item.product_id} (ID: {item.product_id}), Quantity: {item.quantity}
                        </li>
                      ))}
                    </ul>
                  ) : 'No items'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Cart;
