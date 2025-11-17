import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCartItems, emptyCart } from '../store/cartSlice'
import { createOrder, fetchOrder } from '../store/checkOutSlice'
import { initiateKhaltiPayment, verifyKhaltiPayment } from '../store/paymentSlice'
import { STATUSES } from '../statues/statuses'

const Checkout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { items: cartItems, status: cartStatus } = useSelector((state) => state.cart)
  const { status: checkoutStatus } = useSelector((state) => state.checkout)
  const { paymentUrl, status: paymentStatus } = useSelector((state) => state.payment)
  const { isAuthenticated } = useSelector((state) => state.auth)

  // Get payment method from navigation state or default to COD
  const paymentMethodFromState = location.state?.paymentMethod || 'COD'

  const [formData, setFormData] = useState({
    shippingAddress: '',
    phoneNumber: '',
    paymentMethod: paymentMethodFromState,
  })

  // Fetch cart items on component mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCartItems())
    } else {
      navigate('/login')
    }
  }, [dispatch, isAuthenticated, navigate])

  // Handle payment URL redirect for Khalti
  useEffect(() => {
    if (paymentUrl && formData.paymentMethod === 'khalti') {
      // Redirect to Khalti payment page
      window.location.href = paymentUrl
    }
  }, [paymentUrl, formData.paymentMethod])

  // Navigate to orders page after successful COD order creation
  useEffect(() => {
    if (checkoutStatus === STATUSES.SUCCESS && formData.paymentMethod === 'COD') {
      // Small delay to ensure backend has saved the order
      const timer = setTimeout(() => {
        // Fetch orders before navigating to ensure they're available
        dispatch(fetchOrder())
        dispatch(emptyCart())
        navigate('/orders')
      }, 500) // 500ms delay to ensure backend has saved
      
      return () => clearTimeout(timer)
    }
  }, [checkoutStatus, navigate, dispatch, formData.paymentMethod])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items to cart first.')
      navigate('/products')
      return
    }

    if (!formData.shippingAddress || !formData.phoneNumber) {
      alert('Please fill in all required fields')
      return
    }

    // Prepare order data
    const items = cartItems.map(item => ({
      product: item.product._id,
      quantity: item.quantity
    }))

    const subtotal = cartItems.reduce(
      (total, item) => total + (item.product?.productPrice || 0) * item.quantity,
      0
    )
    const shipping = subtotal > 50 ? 0 : 5.99
    const tax = subtotal * 0.1
    const totalAmount = subtotal + shipping + tax

    const orderData = {
      shippingAddress: formData.shippingAddress,
      phoneNumber: formData.phoneNumber,
      items: items,
      totalAmount: totalAmount,
      orderStatus: 'pending', // Explicitly set order status to pending for COD
      paymentDetails: {
        method: formData.paymentMethod,
        status: formData.paymentMethod === 'COD' ? 'pending' : 'pending'
      }
    }

    // Create order first
    try {
      const orderResult = await dispatch(createOrder(orderData))
      
      // Check if order was created successfully
      if (orderResult && orderResult.type === 'checkout/createOrder/fulfilled') {
        if (formData.paymentMethod === 'COD') {
          // For COD, the useEffect will handle navigation when status becomes SUCCESS
          // Don't navigate here - let useEffect handle it after order is saved
          dispatch(emptyCart())
        } else if (formData.paymentMethod === 'khalti') {
          // For Khalti, initiate payment
          const orderId = orderResult.payload?._id
          if (orderId) {
            const paymentResult = await dispatch(initiateKhaltiPayment(orderId, totalAmount))
            if (!paymentResult || !paymentResult.success) {
              alert(paymentResult?.error || 'Failed to initiate payment')
            }
            // Payment URL will be handled by useEffect
          } else {
            alert('Order created but could not get order ID. Please try again.')
          }
        }
      } else {
        alert('Failed to create order. Please check console for details.')
        console.error('Order creation failed:', orderResult)
      }
    } catch (error) {
      console.error('Order creation error:', error)
      alert('An error occurred while creating the order. Please try again.')
    }
  }

  // Calculate totals from cart
  const subtotal = cartItems.reduce(
    (total, item) => total + (item.product?.productPrice || 0) * item.quantity,
    0
  )
  const shipping = subtotal > 50 ? 0 : 5.99
  const tax = subtotal * 0.1
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
              <div className={`p-4 rounded-lg border-2 ${
                formData.paymentMethod === 'COD' 
                  ? 'border-primary-600 bg-primary-50' 
                  : 'border-gray-200'
              }`}>
                <div className="flex items-center space-x-4">
                  <input
                    type="radio"
                    id="COD"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === 'COD'}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                    disabled
                  />
                  <label htmlFor="COD" className="text-gray-700 font-medium">
                    Cash on Delivery (COD)
                  </label>
                </div>
                {formData.paymentMethod === 'COD' && (
                  <p className="mt-2 text-sm text-gray-600 ml-6">
                    You will pay when you receive your order
                  </p>
                )}
              </div>
              <div className={`p-4 rounded-lg border-2 ${
                formData.paymentMethod === 'khalti' 
                  ? 'border-primary-600 bg-primary-50' 
                  : 'border-gray-200'
              }`}>
                <div className="flex items-center space-x-4">
                  <input
                    type="radio"
                    id="khalti"
                    name="paymentMethod"
                    value="khalti"
                    checked={formData.paymentMethod === 'khalti'}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                    disabled
                  />
                  <label htmlFor="khalti" className="text-gray-700 font-medium">
                    Khalti Payment
                  </label>
                </div>
                {formData.paymentMethod === 'khalti' && (
                  <p className="mt-2 text-sm text-gray-600 ml-6">
                    You will be redirected to Khalti payment gateway after placing order
                  </p>
                )}
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
              onClick={handleSubmit}
              disabled={checkoutStatus === STATUSES.LOADING || paymentStatus === STATUSES.LOADING || cartItems.length === 0}
              className="mt-6 w-full bg-primary-600 text-white py-3 rounded-md hover:bg-primary-700 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {checkoutStatus === STATUSES.LOADING || paymentStatus === STATUSES.LOADING 
                ? (formData.paymentMethod === 'khalti' ? 'Initiating Payment...' : 'Placing Order...') 
                : formData.paymentMethod === 'khalti' 
                  ? 'Place Order & Pay with Khalti' 
                  : 'Place Order (COD)'}
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

