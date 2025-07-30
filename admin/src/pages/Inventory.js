import React, { useEffect, useState } from 'react';
import fetchApi from '../api/fetchApi';
import './Inventory.css';

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ product_id: '', quantity: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchInventory = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchApi('/api/admin/inventory');
      setInventory(Array.isArray(data) ? data : data.inventory || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch inventory');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await fetchApi(`/api/admin/inventory/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(form),
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        await fetchApi('/api/admin/inventory', {
          method: 'POST',
          body: JSON.stringify(form),
          headers: { 'Content-Type': 'application/json' },
        });
      }
      setForm({ product_id: '', quantity: '' });
      setEditingId(null);
      fetchInventory();
    } catch (err) {
      setError(err.message || 'Failed to save inventory');
    }
  };

  const handleEdit = item => {
    setForm({
      product_id: item.product_id,
      quantity: item.quantity
    });
    setEditingId(item.id);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this inventory record?')) return;
    try {
      await fetchApi(`/api/admin/inventory/${id}`, { method: 'DELETE' });
      fetchInventory();
    } catch (err) {
      setError(err.message || 'Failed to delete inventory');
    }
  };

  return (
    <div className="inventory-page">
      <h2>Inventory</h2>
      <form className="inventory-form" onSubmit={handleSubmit}>
        <input name="product_id" value={form.product_id || ''} onChange={handleChange} placeholder="Product ID" required />
        <input name="quantity" value={form.quantity || ''} onChange={handleChange} placeholder="Quantity" required />
        <button type="submit">{editingId ? 'Update' : 'Add'} Inventory</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ product_id: '', quantity: '' }); }}>Cancel</button>}
      </form>
      {error && <div className="error">{error}</div>}
      {loading ? <div>Loading...</div> : (
        <table className="inventory-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product ID</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.product_id}</td>
                <td>{item.quantity}</td>
                <td>
                  <button onClick={() => handleEdit(item)}>Edit</button>
                  <button onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Inventory;
