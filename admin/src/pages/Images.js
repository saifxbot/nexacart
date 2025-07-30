import React, { useEffect, useState } from 'react';
import fetchApi from '../api/fetchApi';
import './Images.css';

function Images() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ url: '', alt_text: '', product_id: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchImages = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchApi('/api/admin/images');
      setImages(Array.isArray(data) ? data : data.images || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch images');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await fetchApi(`/api/admin/images/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(form),
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        await fetchApi('/api/admin/images', {
          method: 'POST',
          body: JSON.stringify(form),
          headers: { 'Content-Type': 'application/json' },
        });
      }
      setForm({ url: '', alt_text: '', product_id: '' });
      setEditingId(null);
      fetchImages();
    } catch (err) {
      setError(err.message || 'Failed to save image');
    }
  };

  const handleEdit = img => {
    setForm({
      url: img.url,
      alt_text: img.alt_text || '',
      product_id: img.product_id || ''
    });
    setEditingId(img.id);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await fetchApi(`/api/admin/images/${id}`, { method: 'DELETE' });
      fetchImages();
    } catch (err) {
      setError(err.message || 'Failed to delete image');
    }
  };

  return (
    <div className="images-page">
      <h2>Images</h2>
      <form className="image-form" onSubmit={handleSubmit}>
        <input name="url" value={form.url || ''} onChange={handleChange} placeholder="Image URL" required />
        <input name="alt_text" value={form.alt_text || ''} onChange={handleChange} placeholder="Alt Text" required />
        <input name="product_id" value={form.product_id || ''} onChange={handleChange} placeholder="Product ID" required />
        <button type="submit">{editingId ? 'Update' : 'Add'} Image</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ url: '', alt_text: '', product_id: '' }); }}>Cancel</button>}
      </form>
      {error && <div className="error">{error}</div>}
      {loading ? <div>Loading...</div> : (
        <table className="images-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product ID</th>
              <th>URL</th>
              <th>Alt Text</th>
              <th>Preview</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {images.map(img => (
              <tr key={img.id}>
                <td>{img.id}</td>
                <td>{img.product_id}</td>
                <td>{img.url}</td>
                <td>{img.alt_text}</td>
                <td><img src={img.url} alt={img.alt_text} style={{ maxWidth: 80, maxHeight: 60 }} /></td>
                <td>
                  <button onClick={() => handleEdit(img)}>Edit</button>
                  <button onClick={() => handleDelete(img.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Images;
