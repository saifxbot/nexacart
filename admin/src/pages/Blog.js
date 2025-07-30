import React, { useEffect, useState } from 'react';
import fetchApi from '../api/fetchApi';
import './Blog.css';

function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', content: '', product_ids: [] });
  const [editingId, setEditingId] = useState(null);

  const fetchBlogs = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchApi('/api/admin/blogs');
      setBlogs(Array.isArray(data) ? data : data.blogs || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch blogs');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await fetchApi('/api/admin/products');
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (err) {
      setProducts([]);
    }
  };

  const handleChange = e => {
    const { name, value, options } = e.target;
    if (name === 'product_ids') {
      const selected = Array.from(options).filter(o => o.selected).map(o => o.value);
      setForm({ ...form, product_ids: selected });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    const payload = {
      ...form,
      product_ids: form.product_ids.join(',')
    };
    try {
      if (editingId) {
        await fetchApi(`/api/admin/blogs/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        await fetchApi('/api/admin/blogs', {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: { 'Content-Type': 'application/json' },
        });
      }
      setForm({ title: '', content: '', product_ids: [] });
      setEditingId(null);
      fetchBlogs();
    } catch (err) {
      setError(err.message || 'Failed to save blog');
    }
  };

  const handleEdit = blog => {
    setForm({
      title: blog.title,
      content: blog.content,
      product_ids: blog.product_ids ? blog.product_ids.split(',').filter(Boolean) : []
    });
    setEditingId(blog.id);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this blog post?')) return;
    try {
      await fetchApi(`/api/admin/blogs/${id}`, { method: 'DELETE' });
      fetchBlogs();
    } catch (err) {
      setError(err.message || 'Failed to delete blog');
    }
  };

  return (
    <div className="blog-page">
      <h2>Blog</h2>
      <form className="blog-form" onSubmit={handleSubmit}>
        <input name="title" value={form.title || ''} onChange={handleChange} placeholder="Title" required />
        <textarea name="content" value={form.content || ''} onChange={handleChange} placeholder="Content" required />
        <select name="product_ids" multiple value={form.product_ids} onChange={handleChange} style={{ minWidth: 120 }}>
          {products.map(product => (
            <option key={product.id} value={product.id}>{product.name} (ID: {product.id})</option>
          ))}
        </select>
        <button type="submit">{editingId ? 'Update' : 'Add'} Blog</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ title: '', content: '', product_ids: [] }); }}>Cancel</button>}
      </form>
      {error && <div className="error">{error}</div>}
      {loading ? <div>Loading...</div> : (
        <table className="blog-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Content</th>
              <th>Product IDs</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map(blog => (
              <tr key={blog.id}>
                <td>{blog.id}</td>
                <td>{blog.title}</td>
                <td>{blog.content}</td>
                <td>{blog.product_ids}</td>
                <td>
                  <button onClick={() => handleEdit(blog)}>Edit</button>
                  <button onClick={() => handleDelete(blog.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Blog;
