import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {useSelector, useDispatch} from "react-redux"
import {logOut} from "../store/authSlice"
const Navbar = () => {
  const dispatch = useDispatch()
  // Sample state for UI display (students will replace with Redux)
  // const [isAuthenticated, setIsAuthenticated] = useState(false) // Change to true to see logged in state
  const [cartItemCount, setCartItemCount] = useState(0) // Sample cart count
  const [userName, setUserName] = useState('User') // Sample username


  const {isAuthenticated}=useSelector((state)=>state.auth)

  // Handle logout - students will implement with Redux
  const handleLogout = () => {
    dispatch(logOut())
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-primary-600">
              Tshirt Hub
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/products"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              View All Products
            </Link>
            <Link
              to="/cart"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors relative"
            >
              Cart
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <>
                <span className="text-gray-700 px-3 py-2 text-sm font-medium">
                  {userName}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-700 hover:text-primary-600 focus:outline-none focus:text-primary-600"
              aria-label="Toggle menu"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
          <Link
            to="/products"
            className="text-gray-700 hover:text-primary-600 block px-3 py-2 text-base font-medium"
          >
            View All Products
          </Link>
          <Link
            to="/cart"
            className="text-gray-700 hover:text-primary-600 block px-3 py-2 text-base font-medium relative"
          >
            Cart
            {cartItemCount > 0 && (
              <span className="ml-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 inline-flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>
          {isAuthenticated ? (
            <>
              <span className="text-gray-700 block px-3 py-2 text-base font-medium">
                {userName}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-primary-600 block px-3 py-2 text-base font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-primary-600 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

