import React, { useEffect, useState } from 'react';
import fetchApi from '../api/fetchApi';
import './Promotions.css';

function Promotions() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', discount: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchPromotions = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchApi('/api/admin/promotions');
      setPromotions(Array.isArray(data) ? data : data.promotions || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch promotions');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await fetchApi(`/api/admin/promotions/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(form),
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        await fetchApi('/api/admin/promotions', {
          method: 'POST',
          body: JSON.stringify(form),
          headers: { 'Content-Type': 'application/json' },
        });
      }
      setForm({ name: '', discount: '', description: '' });
      setEditingId(null);
      fetchPromotions();
    } catch (err) {
      setError(err.message || 'Failed to save promotion');
    }
  };

  const handleEdit = promo => {
    setForm({
      title: promo.title,
      discount: promo.discount,
      description: promo.description || ''
    });
    setEditingId(promo.id);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this promotion?')) return;
    try {
      await fetchApi(`/api/admin/promotions/${id}`, { method: 'DELETE' });
      fetchPromotions();
    } catch (err) {
      setError(err.message || 'Failed to delete promotion');
    }
  };

  return (
    <div className="promotions-page">
      <h2>Promotions</h2>
      <form className="promotion-form" onSubmit={handleSubmit}>
        <input name="title" value={form.title || ''} onChange={handleChange} placeholder="Title" required />
        <input name="discount" value={form.discount || ''} onChange={handleChange} placeholder="Discount" required />
        <input name="description" value={form.description || ''} onChange={handleChange} placeholder="Description" required />
        <button type="submit">{editingId ? 'Update' : 'Add'} Promotion</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ title: '', discount: '', description: '' }); }}>Cancel</button>}
      </form>
      {error && <div className="error">{error}</div>}
      {loading ? <div>Loading...</div> : (
        <table className="promotions-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Discount</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map(promo => (
              <tr key={promo.id}>
                <td>{promo.title}</td>
                <td>{promo.discount}</td>
                <td>{promo.description}</td>
                <td>
                  <button onClick={() => handleEdit(promo)}>Edit</button>
                  <button onClick={() => handleDelete(promo.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Promotions;
