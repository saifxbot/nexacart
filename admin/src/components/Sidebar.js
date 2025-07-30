import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  return (
    <div className="sidebar">
      <h2>Nexacart Admin</h2>
      <nav>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/products">Products</NavLink>
        <NavLink to="/categories">Categories</NavLink>
        <NavLink to="/users">Users</NavLink>
        <NavLink to="/promotions">Promotions</NavLink>
        <NavLink to="/images">Images</NavLink>
        <NavLink to="/inventory">Inventory</NavLink>
        <NavLink to="/blog">Blog</NavLink>
        <NavLink to="/orders">Orders</NavLink>
        <NavLink to="/cart">Cart</NavLink>
        <NavLink to="/reviews">Reviews</NavLink>
        {/* Add more links for resources here */}
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </nav>
    </div>
  );
}

export default Sidebar;
