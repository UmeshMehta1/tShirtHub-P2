import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Cart = () => {
  // Sample cart items for UI display (students will replace this with Redux/API)
  const [cartItems, setCartItems] = useState([
    {
      product: {
        _id: '1',
        productName: 'Classic White T-Shirt',
        productPrice: 29.99,
        productImage: 'https://via.placeholder.com/150x150',
      },
      quantity: 2,
    },
    {
      product: {
        _id: '2',
        productName: 'Black Premium Tee',
        productPrice: 34.99,
        productImage: 'https://via.placeholder.com/150x150',
      },
      quantity: 1,
    },
  ])

  // Calculate totals
  const subtotal = cartItems.reduce(
    (total, item) => total + (item.product?.productPrice || 0) * item.quantity,
    0
  )
  const shipping = 5.99
  const tax = subtotal * 0.1
  const total = subtotal + shipping + tax

  // Handler functions - students will implement these with Redux/API
  const handleQuantityChange = (productId, newQuantity) => {
    // Logic will be added here by students
    console.log('Update quantity:', productId, newQuantity)
  }

  const handleDelete = (productId) => {
    // Logic will be added here by students
    console.log('Delete product:', productId)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-24 w-24 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h2 className="mt-4 text-2xl font-semibold text-gray-900">
            Your cart is empty
          </h2>
          <p className="mt-2 text-gray-600">Start adding items to your cart</p>
          <Link
            to="/products"
            className="mt-6 inline-block bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.product?._id || item._id} className="p-6 flex flex-col sm:flex-row">
                    <div className="flex-shrink-0">
                      <img
                        src={item.product?.productImage || 'https://via.placeholder.com/150x150'}
                        alt={item.product?.productName || 'Product'}
                        className="h-32 w-32 object-cover rounded-md"
                      />
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.product?.productName || 'Product Name'}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Price: ${item.product?.productPrice || 0}
                          </p>
                        </div>
                        <button 
                          onClick={() => handleDelete(item.product?._id)} 
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button 
                            className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50" 
                            onClick={() => handleQuantityChange(item.product?._id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span className="text-lg font-medium">
                            {item.quantity}
                          </span>
                          <button 
                            className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
                            onClick={() => handleQuantityChange(item.product?._id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          ${((item.product?.productPrice || 0) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6">
              <Link
                to="/products"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <Link
                to="/checkout"
                className="block w-full bg-primary-600 text-white text-center py-3 rounded-md hover:bg-primary-700 transition-colors font-semibold"
              >
                Proceed to Checkout
              </Link>
              <p className="mt-4 text-sm text-gray-500 text-center">
                Free shipping on orders over $50
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart

