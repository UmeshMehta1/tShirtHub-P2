import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCartItems } from '../store/cartSlice'
import { STATUSES } from '../statues/statuses'

const Payment = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items: cartItems } = useSelector((state) => state.cart)
  const { isAuthenticated } = useSelector((state) => state.auth)

  const [selectedPayment, setSelectedPayment] = useState('COD')

  // Fetch cart items on component mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCartItems())
    } else {
      navigate('/login')
    }
  }, [dispatch, isAuthenticated, navigate])

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && isAuthenticated) {
      alert('Your cart is empty. Please add items to cart first.')
      navigate('/products')
    }
  }, [cartItems.length, isAuthenticated, navigate])

  // Calculate totals
  const subtotal = cartItems.reduce(
    (total, item) => total + (item.product?.productPrice || 0) * item.quantity,
    0
  )
  const shipping = subtotal > 50 ? 0 : 5.99
  const tax = subtotal * 0.1
  const total = subtotal + shipping + tax

  const handlePaymentSelection = (method) => {
    setSelectedPayment(method)
  }

  const handleProceed = () => {
    if (selectedPayment === 'COD') {
      // Redirect to checkout for COD
      navigate('/checkout', { state: { paymentMethod: 'COD' } })
    } else if (selectedPayment === 'khalti') {
      // Redirect to checkout for Khalti
      navigate('/checkout', { state: { paymentMethod: 'khalti' } })
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Select Payment Method</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Options */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Choose Payment Method
            </h2>
            
            {/* COD Option */}
            <div
              onClick={() => handlePaymentSelection('COD')}
              className={`border-2 rounded-lg p-6 cursor-pointer transition-all mb-4 ${
                selectedPayment === 'COD'
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <input
                    type="radio"
                    id="COD"
                    name="paymentMethod"
                    value="COD"
                    checked={selectedPayment === 'COD'}
                    onChange={() => handlePaymentSelection('COD')}
                    className="h-5 w-5 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <label htmlFor="COD" className="text-lg font-semibold text-gray-900 cursor-pointer">
                      Cash on Delivery (COD)
                    </label>
                    <p className="text-sm text-gray-600 mt-1">
                      Pay when you receive your order
                    </p>
                  </div>
                </div>
                <div className="text-2xl">💵</div>
              </div>
            </div>

            {/* Khalti Option */}
            <div
              onClick={() => handlePaymentSelection('khalti')}
              className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                selectedPayment === 'khalti'
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <input
                    type="radio"
                    id="khalti"
                    name="paymentMethod"
                    value="khalti"
                    checked={selectedPayment === 'khalti'}
                    onChange={() => handlePaymentSelection('khalti')}
                    className="h-5 w-5 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <label htmlFor="khalti" className="text-lg font-semibold text-gray-900 cursor-pointer">
                      Khalti Payment
                    </label>
                    <p className="text-sm text-gray-600 mt-1">
                      Pay securely with Khalti
                    </p>
                  </div>
                </div>
                <div className="text-2xl">💳</div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> After selecting your payment method, you'll be redirected to complete your order details.
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Order Summary
            </h2>
            <div className="space-y-4 mb-6">
              {cartItems.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No items in cart</p>
              ) : (
                cartItems.map((item) => (
                  <div key={item.product?._id} className="flex items-center space-x-4">
                    <img
                      src={item.product?.productImage ? `http://localhost:3000/upload/${item.product.productImage}` : 'https://via.placeholder.com/80x80'}
                      alt={item.product?.productName || 'Product'}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {item.product?.productName || 'Product Name'}
                      </h4>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold text-gray-900">
                        RS. {((item.product?.productPrice || 0) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>RS. {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `RS. ${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>RS. {tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>RS. {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleProceed}
              disabled={cartItems.length === 0}
              className="mt-6 w-full bg-primary-600 text-white py-3 rounded-md hover:bg-primary-700 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Proceed to Checkout
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

export default Payment

