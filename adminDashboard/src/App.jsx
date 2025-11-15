import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store/store'
import AdminLogin from './pages/AdminLogin'
import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import ProductForm from './pages/ProductForm'
import Orders from './pages/Orders'
import Users from './pages/Users'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="products/create" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} />
            <Route path="orders" element={<Orders />} />
            <Route path="users" element={<Users />} />
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
          </Route>
          <Route path="/" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </Router>
    </Provider>
  )
}

export default App

