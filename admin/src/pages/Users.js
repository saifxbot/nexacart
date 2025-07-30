import React, { useEffect, useState } from 'react';
import fetchApi from '../api/fetchApi';
import './Users.css';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Remove form and editing state

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchApi('/api/admin/users');
      if (Array.isArray(data)) {
        setUsers(data);
      } else if (data && Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        setUsers([]);
        setError('No users found or unexpected response');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Remove handleChange, handleSubmit, handleEdit

  const handleDelete = async id => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await fetchApi(`/api/admin/users/${id}`, { method: 'DELETE' });
      fetchUsers();
    } catch (err) {
      setError(err.message || 'Failed to delete user');
    }
  };

  return (
    <div className="users-page">
      <h2>Users</h2>
      {/* User add/update form removed for admin */}
      {error && <div className="error">{error}</div>}
      {loading ? <div>Loading...</div> : (
        <table className="users-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Admin</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.is_admin ? 'Yes' : 'No'}</td>
                <td>
                  <button onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Users;
