import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Checkout = () => {
  const [formData, setFormData] = useState({
    shippingAddress: '',
    phoneNumber: '',
    paymentMethod: 'COD',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Logic will be added here
  }

  const subtotal = 99.97
  const shipping = 5.99
  const tax = 9.99
  const total = subtotal + shipping + tax

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Shipping Information
            </h2>
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="shippingAddress"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Shipping Address
                </label>
                <textarea
                  id="shippingAddress"
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your complete shipping address (Street, City, State, ZIP, Country)"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </form>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Payment Method
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <input
                  type="radio"
                  id="COD"
                  name="paymentMethod"
                  value="COD"
                  checked={formData.paymentMethod === 'COD'}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="COD" className="text-gray-700 font-medium">
                  Cash on Delivery (COD)
                </label>
              </div>
              <div className="flex items-center space-x-4">
                <input
                  type="radio"
                  id="khalti"
                  name="paymentMethod"
                  value="khalti"
                  checked={formData.paymentMethod === 'khalti'}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="khalti" className="text-gray-700 font-medium">
                  Khalti
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Order Summary
            </h2>
            <div className="space-y-4 mb-6">
              {/* Sample Order Items */}
              <div className="flex items-center space-x-4">
                <img
                  src="https://via.placeholder.com/80x80"
                  alt="Product"
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    Classic White T-Shirt
                  </h4>
                  <p className="text-sm text-gray-500">Qty: 2</p>
                  <p className="text-sm font-semibold text-gray-900">
                    $59.98
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <img
                  src="https://via.placeholder.com/80x80"
                  alt="Product"
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    Black Premium Tee
                  </h4>
                  <p className="text-sm text-gray-500">Qty: 1</p>
                  <p className="text-sm font-semibold text-gray-900">
                    $34.99
                  </p>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4 space-y-3">
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
            <button
              onClick={handleSubmit}
              className="mt-6 w-full bg-primary-600 text-white py-3 rounded-md hover:bg-primary-700 transition-colors font-semibold text-lg"
            >
              Place Order
            </button>
            <Link
              to="/cart"
              className="mt-4 block text-center text-primary-600 hover:text-primary-700 text-sm"
            >
              ← Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout

