import React, { useEffect, useState } from 'react';
import fetchApi from '../api/fetchApi';
import './Reviews.css';

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReviews = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchApi('/api/reviews/admin');
      setReviews(Array.isArray(data) ? data : data.reviews || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch reviews');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await fetchApi(`/api/reviews/admin/${reviewId}`, { method: 'DELETE' });
      setReviews(reviews.filter(r => r.id !== reviewId));
    } catch (err) {
      setError(err.message || 'Failed to delete review');
    }
  };

  return (
    <div className="reviews-page">
      <h2>Product Reviews</h2>
      {error && <div className="error">{error}</div>}
      {loading ? <div>Loading...</div> : (
        <table className="reviews-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product ID</th>
              <th>User ID</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map(review => (
              <tr key={review.id}>
                <td>{review.id}</td>
                <td>{review.product_id}</td>
                <td>{review.user_id}</td>
                <td>{review.rating}</td>
                <td>{review.comment}</td>
                <td>{review.created_at}</td>
                <td>
                  <button onClick={() => handleDelete(review.id)} style={{color: 'red'}}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Reviews;
