import React, { useEffect, useState } from 'react';
import fetchApi from '../api/fetchApi';
import './Categories.css';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchApi('/api/admin/categories');
      if (Array.isArray(data)) {
        setCategories(data);
      } else if (data && Array.isArray(data.categories)) {
        setCategories(data.categories);
      } else {
        setCategories([]);
        setError('No categories found or unexpected response');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch categories');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await fetchApi(`/api/admin/categories/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(form),
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        await fetchApi('/api/admin/categories', {
          method: 'POST',
          body: JSON.stringify(form),
          headers: { 'Content-Type': 'application/json' },
        });
      }
      setForm({ name: '', description: '' });
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      setError(err.message || 'Failed to save category');
    }
  };

  const handleEdit = category => {
    setForm({ name: category.name, description: category.description || '' });
    setEditingId(category.id);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await fetchApi(`/api/admin/categories/${id}`, { method: 'DELETE' });
      fetchCategories();
    } catch (err) {
      setError(err.message || 'Failed to delete category');
    }
  };

  return (
    <div className="categories-page">
      <h2>Categories</h2>
      <form className="category-form" onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
        <input name="description" value={form.description} onChange={handleChange} placeholder="Description" />
        <button type="submit">{editingId ? 'Update' : 'Add'} Category</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', description: '' }); }}>Cancel</button>}
      </form>
      {error && <div className="error">{error}</div>}
      {loading ? <div>Loading...</div> : (
        <table className="categories-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td>
                  <button onClick={() => handleEdit(category)}>Edit</button>
                  <button onClick={() => handleDelete(category.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Categories;
