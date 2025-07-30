import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import './App.css';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Users from './pages/Users';
import Promotions from './pages/Promotions';
import Images from './pages/Images';
import Inventory from './pages/Inventory';
import Blog from './pages/Blog';
import Orders from './pages/Orders';
import Reviews from './pages/Reviews';
import Cart from './pages/Cart';

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="main-layout">
                <Sidebar />
                <div className="main-content">
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="products" element={<Products />} />
                    <Route path="categories" element={<Categories />} />
                    <Route path="users" element={<Users />} />
                    <Route path="promotions" element={<Promotions />} />
                    <Route path="images" element={<Images />} />
                    <Route path="inventory" element={<Inventory />} />
                    <Route path="blog" element={<Blog />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="reviews" element={<Reviews />} />
                    <Route path="*" element={<Navigate to="dashboard" />} />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
