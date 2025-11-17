import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCartItems, updateCartItem, deleteCartItem, updateItems, deleteItem } from '../store/cartSlice'
import { STATUSES } from '../statues/statuses'

const Cart = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items: cartItems, status } = useSelector((state) => state.cart)
  const { isAuthenticated } = useSelector((state) => state.auth)

  // Fetch cart items on component mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCartItems())
    } else {
      navigate('/login')
    }
  }, [dispatch, isAuthenticated, navigate])

  // Calculate totals
  const subtotal = cartItems.reduce(
    (total, item) => total + (item.product?.productPrice || 0) * item.quantity,
    0
  )
  
  const shipping = subtotal > 50 ? 0 : 5.99
  const tax = subtotal * 0.1
  const total = subtotal + shipping + tax

  // Handler functions
  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      return
    }
    
    // Update optimistically in Redux first for instant UI feedback
    dispatch(updateItems({ productId, quantity: newQuantity }))
    
    // Then sync with backend silently in the background
    try {
      const result = await dispatch(updateCartItem(productId, newQuantity))
      // If update fails, fetch to get correct state from backend
      if (result && !result.success) {
        dispatch(fetchCartItems())
      }
    } catch (error) {
      console.error('Failed to update quantity:', error)
      // If update fails, fetch to get correct state from backend
      dispatch(fetchCartItems())
    }
  }

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to remove this item from cart?')) {
      // Remove optimistically from Redux first for instant UI feedback
      dispatch(deleteItem({ productId }))
      
      // Then sync with backend silently in the background
      try {
        const result = await dispatch(deleteCartItem(productId))
        // If delete fails, fetch to get correct state from backend
        if (result && !result.success) {
          dispatch(fetchCartItems())
        }
      } catch (error) {
        console.error('Failed to delete item:', error)
        // If delete fails, fetch to get correct state from backend
        dispatch(fetchCartItems())
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      {/* Only show loading on initial fetch, not on updates/deletes */}
      {status === STATUSES.LOADING && cartItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading cart items...</p>
        </div>
      ) : cartItems.length === 0 ? (
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
                        src={item.product?.productImage ? `http://localhost:3000/upload/${item.product.productImage}` : 'https://via.placeholder.com/150x150'}
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
                            Price: RS. {item.product?.productPrice || 0}
                          </p>
                        </div>
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleDelete(item.product?._id)
                          }}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded transition-colors"
                          aria-label="Delete item"
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
                            type="button"
                            className="px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 active:bg-gray-100 transition-colors font-medium min-w-[36px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white" 
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              if (item.quantity > 1) {
                                handleQuantityChange(item.product?._id, item.quantity - 1)
                              }
                            }}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="text-lg font-medium min-w-[30px] text-center">
                            {item.quantity}
                          </span>
                          <button 
                            type="button"
                            className="px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 active:bg-gray-100 transition-colors font-medium min-w-[36px]"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleQuantityChange(item.product?._id, item.quantity + 1)
                            }}
                          >
                            +
                          </button>
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          RS. {((item.product?.productPrice || 0) * item.quantity).toFixed(2)}
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
              <Link
                to="/payment"
                className="block w-full bg-primary-600 text-white text-center py-3 rounded-md hover:bg-primary-700 transition-colors font-semibold"
              >
                Proceed to Payment
              </Link>
              <p className="mt-4 text-sm text-gray-500 text-center">
                Free shipping on orders over RS. 50
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart

