import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Checkout from './pages/Checkout'
import Review from './pages/Review'
import Orders from './pages/Orders'
import AllOrders from './pages/AllOrders'
import CreateProduct from './pages/CreateProduct'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/review/:id" element={<Review />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/all-orders" element={<AllOrders />} />
            <Route path="/create-product" element={<CreateProduct />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App

