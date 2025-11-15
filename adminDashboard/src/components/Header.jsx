import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logOut } from '../store/adminAuthSlice'

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { data: adminData } = useSelector((state) => state.adminAuth)

  const handleLogout = () => {
    dispatch(logOut())
    navigate('/admin/login')
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 right-0 left-64 z-10">
      <div className="px-6 py-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">
              {adminData?.userName || 'Admin'}
            </p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header

