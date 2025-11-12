import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrder, cancelOrder } from '../store/checkOutSlice'
import { STATUSES } from '../statues/statuses'

const Orders = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { orders, status } = useSelector((state) => state.checkout)
  const { isAuthenticated } = useSelector((state) => state.auth)
  const [cancellingOrderId, setCancellingOrderId] = useState(null)

  // Fetch orders on component mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchOrder())
    } else {
      navigate('/login')
    }
  }, [dispatch, isAuthenticated, navigate])

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Format order status for display
  const formatStatus = (status) => {
    const statusMap = {
      pending: 'Pending',
      preparation: 'In Preparation',
      ontheway: 'On The Way',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    }
    return statusMap[status?.toLowerCase()] || status || 'Unknown'
  }

  // Get status color
  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase()
    switch (statusLower) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'ontheway':
        return 'bg-blue-100 text-blue-800'
      case 'preparation':
        return 'bg-purple-100 text-purple-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Get payment method display
  const getPaymentMethod = (paymentDetails) => {
    if (!paymentDetails) return 'N/A'
    return paymentDetails.method === 'khalti' ? 'Khalti' : 'Cash on Delivery'
  }

  // Get payment status display
  const getPaymentStatus = (paymentDetails) => {
    if (!paymentDetails) return 'N/A'
    const statusMap = {
      paid: 'Paid',
      unpaid: 'Unpaid',
      pending: 'Pending',
    }
    return statusMap[paymentDetails.status?.toLowerCase()] || paymentDetails.status || 'Pending'
  }

  // Handle cancel order
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return
    }

    setCancellingOrderId(orderId)
    try {
      const result = await dispatch(cancelOrder(orderId))
      if (result && result.success) {
        alert('Order cancelled successfully')
        // Orders will be refreshed automatically by cancelOrder
      } else {
        alert(result?.error || 'Failed to cancel order')
      }
    } catch (error) {
      console.error('Cancel order error:', error)
      alert('Failed to cancel order')
    } finally {
      setCancellingOrderId(null)
    }
  }

  // Handle view details
  const handleViewDetails = (order) => {
    // You can implement a modal or navigate to a details page
    alert(`Order Details:\n\nOrder ID: ${order._id}\nStatus: ${formatStatus(order.orderStatus)}\nTotal: RS. ${order.totalAmount?.toFixed(2)}\nPayment: ${getPaymentMethod(order.paymentDetails)} - ${getPaymentStatus(order.paymentDetails)}\nShipping: ${order.shippingAddress || 'N/A'}`)
  }

  // Handle loading state
  if (status === STATUSES.LOADING) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    )
  }

  // Handle error state
  if (status === STATUSES.ERROR) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">Failed to load orders. Please try again.</p>
          <button
            onClick={() => dispatch(fetchOrder())}
            className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Check if orders array is empty or null
  const ordersList = orders && Array.isArray(orders) ? orders : []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

      {ordersList.length === 0 ? (
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h2 className="mt-4 text-2xl font-semibold text-gray-900">
            No orders yet
          </h2>
          <p className="mt-2 text-gray-600">
            Start shopping to see your orders here
          </p>
          <Link
            to="/products"
            className="mt-6 inline-block bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {ordersList.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order._id?.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                    {order.shippingAddress && (
                      <p className="text-sm text-gray-500 mt-1">
                        Shipping: {order.shippingAddress}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="flex flex-col items-end">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          order.orderStatus
                        )}`}
                      >
                        {formatStatus(order.orderStatus)}
                      </span>
                      {order.paymentDetails && (
                        <span className="text-xs text-gray-500 mt-1">
                          {getPaymentMethod(order.paymentDetails)} - {getPaymentStatus(order.paymentDetails)}
                        </span>
                      )}
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      RS. {order.totalAmount?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="space-y-4">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-4"
                        >
                          <img
                            src={item.product?.productImage || 'https://via.placeholder.com/100x100'}
                            alt={item.product?.productName || 'Product'}
                            className="w-20 h-20 object-cover rounded-md"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {item.product?.productName || 'Product Name'}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Quantity: {item.quantity}
                            </p>
                            <p className="text-sm font-semibold text-gray-900 mt-1">
                              RS. {item.product?.productPrice ? (item.product.productPrice * item.quantity).toFixed(2) : '0.00'}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No items in this order</p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-4">
                  <button 
                    type="button"
                    onClick={() => handleViewDetails(order)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    View Details
                  </button>
                  {order.orderStatus?.toLowerCase() === 'delivered' && (
                    <Link
                      to={`/review/${order._id}`}
                      className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-center font-medium"
                    >
                      Write Review
                    </Link>
                  )}
                  {order.orderStatus?.toLowerCase() === 'delivered' && (
                    <button 
                      type="button"
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    >
                      Reorder
                    </button>
                  )}
                  {(order.orderStatus?.toLowerCase() === 'pending' || order.orderStatus?.toLowerCase() === 'preparation') && (
                    <button 
                      type="button"
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={cancellingOrderId === order._id}
                      className="px-4 py-2 border border-red-300 rounded-md text-red-700 hover:bg-red-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {cancellingOrderId === order._id ? 'Cancelling...' : 'Cancel Order'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders

