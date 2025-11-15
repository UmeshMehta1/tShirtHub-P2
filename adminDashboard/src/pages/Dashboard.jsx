import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../store/adminProductSlice'
import { fetchOrders } from '../store/adminOrderSlice'
import { fetchUsers } from '../store/adminUserSlice'
import { STATUSES } from '../statues/statuses'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { products, status: productStatus } = useSelector((state) => state.adminProduct)
  const { orders, status: orderStatus } = useSelector((state) => state.adminOrder)
  const { users, status: userStatus } = useSelector((state) => state.adminUser)

  useEffect(() => {
    dispatch(fetchProducts())
    dispatch(fetchOrders())
    dispatch(fetchUsers())
  }, [dispatch])

  const stats = [
    {
      name: 'Total Products',
      value: products.length,
      icon: '📦',
      color: 'bg-blue-500',
    },
    {
      name: 'Total Orders',
      value: orders.length,
      icon: '🛒',
      color: 'bg-green-500',
    },
    {
      name: 'Total Users',
      value: users.length,
      icon: '👥',
      color: 'bg-purple-500',
    },
    {
      name: 'Pending Orders',
      value: orders.filter(o => o.orderStatus === 'pending').length,
      icon: '⏳',
      color: 'bg-yellow-500',
    },
  ]

  const recentOrders = orders.slice(0, 5)
  const totalRevenue = orders
    .filter(o => o.paymentDetails?.status === 'paid')
    .reduce((sum, order) => sum + (order.totalAmount || 0), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-2 text-gray-600">Welcome to the admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} rounded-full p-3`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Card */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-xl font-semibold mb-2">Total Revenue</h2>
        <p className="text-4xl font-bold">RS {totalRevenue.toLocaleString()}</p>
        <p className="text-primary-200 mt-2">From paid orders</p>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
        </div>
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
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productStatus === STATUSES.LOADING || orderStatus === STATUSES.LOADING ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>    
              ) : (
                recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order._id.slice(-8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.user?.userName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      RS {order.totalAmount?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.orderStatus === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.orderStatus === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : order.orderStatus === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.paymentDetails?.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.paymentDetails?.status || 'pending'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

