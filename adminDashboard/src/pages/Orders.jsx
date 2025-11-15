import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrders, updateOrderStatus, updatePaymentStatus, updateOrder } from '../store/adminOrderSlice'
import { STATUSES } from '../statues/statuses'

const Orders = () => {
  const dispatch = useDispatch()
  const { orders, status } = useSelector((state) => state.adminOrder)
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    dispatch(fetchOrders())
  }, [dispatch])

  const handleOrderStatusChange = async (orderId, newStatus) => {
    // optimistic UI update: update local store immediately
    const prevOrder = orders.find(o => o._id === orderId)
    if (!prevOrder) return

    setUpdatingId(orderId)
    // apply optimistic update
    dispatch(updateOrder({ ...prevOrder, orderStatus: newStatus }))

    const result = await dispatch(updateOrderStatus(orderId, newStatus))
    setUpdatingId(null)

    if (result.success) {
      // success — we already updated optimistically; refresh to ensure consistency
      dispatch(fetchOrders())
      // optional: show success message
    } else {
      // revert optimistic update on failure
      dispatch(updateOrder(prevOrder))
      alert(result.error || 'Failed to update order status')
    }
  }

  const handlePaymentStatusChange = async (orderId, newStatus) => {
    const prevOrder = orders.find(o => o._id === orderId)
    if (!prevOrder) return

    setUpdatingId(orderId)
    // optimistic update
    dispatch(updateOrder({ ...prevOrder, paymentDetails: { ...prevOrder.paymentDetails, status: newStatus } }))

    const result = await dispatch(updatePaymentStatus(orderId, newStatus))
    setUpdatingId(null)

    if (result.success) {
      dispatch(fetchOrders())
    } else {
      // revert
      dispatch(updateOrder(prevOrder))
      alert(result.error || 'Failed to update payment status')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="mt-2 text-gray-600">Manage and track all orders</p>
      </div>

      {status === STATUSES.LOADING && orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order._id.slice(-8)}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.user?.userName || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{order.user?.userEmail || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.items?.length || 0} item(s)
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.items?.map((item) => item.product?.productName).join(', ').slice(0, 50)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      RS {order.totalAmount?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.orderStatus || 'pending'}
                        onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                        disabled={updatingId === order._id}
                        className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${
                          order.orderStatus === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.orderStatus === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : order.orderStatus === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="preparation">Preparation</option>
                        <option value="ontheway">On The Way</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.paymentDetails?.status || 'pending'}
                        onChange={(e) => handlePaymentStatusChange(order._id, e.target.value)}
                        disabled={updatingId === order._id}
                        className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${
                          order.paymentDetails?.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="unpaid">Unpaid</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {updatingId === order._id ? (
                        <span className="text-gray-500">Updating...</span>
                      ) : (
                        <button
                          onClick={() => {
                            const details = `
Order ID: ${order._id}
Customer: ${order.user?.userName || 'N/A'}
Email: ${order.user?.userEmail || 'N/A'}
Phone: ${order.phoneNumber || 'N/A'}
Total: RS ${order.totalAmount || 0}
Status: ${order.orderStatus}
Payment: ${order.paymentDetails?.status || 'pending'}
Shipping: ${order.shippingAddress || 'N/A'}
                            `.trim()
                            alert(details)
                          }}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          View Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders

