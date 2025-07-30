
import React, { useEffect, useState } from 'react';
import fetchApi from '../api/fetchApi';
import './Products.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', price: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchApi('/api/admin/products');
      // Support both {products: [...]} and [...] response
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        setProducts([]);
        setError('No products found or unexpected response');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const data = await fetchApi('/api/admin/categories');
      if (Array.isArray(data)) {
        setCategories(data);
      } else if (data && Array.isArray(data.categories)) {
        setCategories(data.categories);
      } else {
        setCategories([]);
      }
    } catch (err) {
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchProducts();
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
        await fetchApi(`/api/admin/products/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(form),
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        await fetchApi('/api/admin/products', {
          method: 'POST',
          body: JSON.stringify(form),
          headers: { 'Content-Type': 'application/json' },
        });
      }
      setForm({ name: '', price: '', description: '' });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      setError(err.message || 'Failed to save product');
    }
  };

  const handleEdit = product => {
    setForm({
      name: product.name,
      price: product.price,
      description: product.description || ''
    });
    setEditingId(product.id);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await fetchApi(`/api/admin/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (err) {
      setError(err.message || 'Failed to delete product');
    }
  };

  return (
    <div className="products-page">
      <h2>Products</h2>
      <form className="product-form" onSubmit={handleSubmit}>
        <input name="name" value={form.name || ''} onChange={handleChange} placeholder="Name" required />
        <input name="price" value={form.price || ''} onChange={handleChange} placeholder="Price" required />
        {/* category_id input removed */}
        <input name="description" value={form.description || ''} onChange={handleChange} placeholder="Description" required />
        <button type="submit">{editingId ? 'Update' : 'Add'} Product</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', price: '', description: '' }); }}>Cancel</button>}
      </form>
      {error && <div className="error">{error}</div>}
      {loading ? <div>Loading...</div> : (
        <table className="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              {/* Category column removed */}
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                {/* category_id column removed */}
                <td>{product.description}</td>
                <td>
                  <button onClick={() => handleEdit(product)}>Edit</button>
                  <button onClick={() => handleDelete(product.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Products;
