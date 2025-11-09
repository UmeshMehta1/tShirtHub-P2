# Frontend Implementation Guide

## Step-by-Step Guide for Teaching React Redux Toolkit, Authentication, and Cart Functionality

This guide will walk you through implementing Redux Toolkit, authentication (login/signup), and add to cart functionality in your React frontend application.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Install Required Dependencies](#step-1-install-required-dependencies)
3. [Step 2: Setup Redux Toolkit Store](#step-2-setup-redux-toolkit-store)
4. [Step 3: Create Auth Slice](#step-3-create-auth-slice)
5. [Step 4: Create Cart Slice](#step-4-create-cart-slice)
6. [Step 5: Setup API Configuration](#step-5-setup-api-configuration)
7. [Step 6: Implement Login Functionality](#step-6-implement-login-functionality)
8. [Step 7: Implement Signup Functionality](#step-7-implement-signup-functionality)
9. [Step 8: Implement Add to Cart](#step-8-implement-add-to-cart)
10. [Step 9: Display Cart Items](#step-9-display-cart-items)
11. [Step 10: Protected Routes](#step-10-protected-routes)

---

## Prerequisites

Before starting, ensure you have:
- Node.js installed (v16 or higher)
- Basic understanding of React Hooks
- Backend server running on `http://localhost:5000` (or your configured port)
- Understanding of REST API concepts

---

## Step 1: Install Required Dependencies

First, install Redux Toolkit and React-Redux:

```bash
npm install @reduxjs/toolkit react-redux
```

**What we're installing:**
- `@reduxjs/toolkit`: Modern Redux with simplified API
- `react-redux`: React bindings for Redux

---

## Step 2: Setup Redux Toolkit Store

### 2.1 Create Store Directory Structure

Create the following folder structure in your `src` directory:

```
src/
  store/
    index.js          # Store configuration
    slices/
      authSlice.js    # Authentication state
      cartSlice.js    # Cart state
```

### 2.2 Create Store Configuration (`src/store/index.js`)

```javascript
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import cartReducer from './slices/cartSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
})

export default store
```

**Explanation:**
- `configureStore`: Sets up Redux store with good defaults
- `reducer`: Combines all our slices (auth, cart)
- Each slice manages a specific part of the application state

### 2.3 Wrap App with Provider (`src/main.jsx`)

Update your `main.jsx` to provide the store to all components:

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
```

**What this does:**
- `Provider`: Makes Redux store available to all components
- All child components can now access the store using hooks

---

## Step 3: Create Auth Slice

### 3.1 Create Auth Slice (`src/store/slices/authSlice.js`)

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// API Base URL - Update this to match your backend
const API_URL = 'http://localhost:5000/api/auth'

// Async Thunk for User Registration
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed'
      )
    }
  }
)

// Async Thunk for User Login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials)
      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.data[0]))
      }
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed'
      )
    }
  }
)

// Initial State
const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
}

// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    clearError: (state) => {
      state.error = null
    },
    setUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
  },
  extraReducers: (builder) => {
    // Register
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false
      state.error = null
      // Registration successful, but user needs to login
    })
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload.data[0]
      state.token = action.payload.token
      state.isAuthenticated = true
      state.error = null
    })
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
      state.isAuthenticated = false
    })
  },
})

export const { logout, clearError, setUser } = authSlice.actions
export default authSlice.reducer
```

**Key Concepts Explained:**

1. **createAsyncThunk**: Handles async operations (API calls)
   - Automatically generates pending, fulfilled, and rejected actions
   - First parameter: action type prefix
   - Second parameter: async function that returns a promise

2. **createSlice**: Creates reducer and actions together
   - `name`: Slice name (used in action types)
   - `initialState`: Starting state
   - `reducers`: Synchronous actions (logout, clearError)
   - `extraReducers`: Handles async thunk actions

3. **localStorage**: Persists authentication state
   - Token stored for API authentication
   - User data stored for quick access

---

## Step 4: Create Cart Slice

### 4.1 Create Cart Slice (`src/store/slices/cartSlice.js`)

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// API Base URL
const API_URL = 'http://localhost:5000/api/cart'

// Get token from localStorage for authenticated requests
const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

// Async Thunk: Add Product to Cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/${productId}`,
        {},
        getAuthHeaders()
      )
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add to cart'
      )
    }
  }
)

// Async Thunk: Get Cart Items
export const fetchCartItems = createAsyncThunk(
  'cart/fetchCartItems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}`, getAuthHeaders())
      return response.data.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch cart'
      )
    }
  }
)

// Async Thunk: Update Cart Item Quantity
export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_URL}/${productId}`,
        { quantity },
        getAuthHeaders()
      )
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update cart'
      )
    }
  }
)

// Async Thunk: Remove Item from Cart
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_URL}/${productId}`,
        getAuthHeaders()
      )
      return { productId, data: response.data }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to remove from cart'
      )
    }
  }
)

// Initial State
const initialState = {
  items: [],
  loading: false,
  error: null,
  totalItems: 0,
  totalPrice: 0,
}

// Cart Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = []
      state.totalItems = 0
      state.totalPrice = 0
    },
    calculateTotals: (state) => {
      state.totalItems = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      )
      state.totalPrice = state.items.reduce(
        (total, item) =>
          total + item.quantity * (item.product?.productPrice || 0),
        0
      )
    },
  },
  extraReducers: (builder) => {
    // Add to Cart
    builder.addCase(addToCart.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(addToCart.fulfilled, (state, action) => {
      state.loading = false
      // Refetch cart items to get updated cart
      // Or update state directly if response includes cart data
    })
    builder.addCase(addToCart.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

    // Fetch Cart Items
    builder.addCase(fetchCartItems.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchCartItems.fulfilled, (state, action) => {
      state.loading = false
      state.items = action.payload
      // Calculate totals after fetching
      state.totalItems = action.payload.reduce(
        (total, item) => total + item.quantity,
        0
      )
      state.totalPrice = action.payload.reduce(
        (total, item) =>
          total + item.quantity * (item.product?.productPrice || 0),
        0
      )
    })
    builder.addCase(fetchCartItems.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

    // Update Cart Item
    builder.addCase(updateCartItem.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(updateCartItem.fulfilled, (state) => {
      state.loading = false
      // Refetch or update state
    })
    builder.addCase(updateCartItem.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

    // Remove from Cart
    builder.addCase(removeFromCart.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(removeFromCart.fulfilled, (state, action) => {
      state.loading = false
      state.items = state.items.filter(
        (item) => item.product._id !== action.payload.productId
      )
      // Recalculate totals
      state.totalItems = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      )
      state.totalPrice = state.items.reduce(
        (total, item) =>
          total + item.quantity * (item.product?.productPrice || 0),
        0
      )
    })
    builder.addCase(removeFromCart.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })
  },
})

export const { clearCart, calculateTotals } = cartSlice.actions
export default cartSlice.reducer
```

**Key Points:**
- `getAuthHeaders()`: Helper function to include JWT token in requests
- Cart state includes items, loading, error, and calculated totals
- After any cart operation, totals are recalculated

---

## Step 5: Setup API Configuration

### 5.1 Create API Configuration File (`src/utils/api.js`)

```javascript
import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
```

**Why this is useful:**
- Centralized API configuration
- Automatically adds token to all requests
- Handles token expiration globally

---

## Step 6: Implement Login Functionality

### 6.1 Update Login Component (`src/pages/Login.jsx`)

```javascript
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, clearError } from '../store/slices/authSlice'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(clearError()) // Clear previous errors
    
    try {
      const result = await dispatch(loginUser(formData))
      
      if (loginUser.fulfilled.match(result)) {
        // Login successful
        navigate('/')
      }
    } catch (err) {
      // Error is handled by Redux
      console.error('Login error:', err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/signup"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              create a new account
            </Link>
          </p>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
```

**Key React-Redux Hooks:**
- `useDispatch()`: Get dispatch function to trigger actions
- `useSelector()`: Access Redux state
- `loginUser.fulfilled.match(result)`: Check if async action succeeded

---

## Step 7: Implement Signup Functionality

### 7.1 Update Signup Component (`src/pages/Signup.jsx`)

```javascript
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser, clearError } from '../store/slices/authSlice'

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    userNumber: '',
    password: '',
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(clearError())
    
    try {
      const result = await dispatch(registerUser(formData))
      
      if (registerUser.fulfilled.match(result)) {
        // Registration successful - redirect to login
        alert('Registration successful! Please login.')
        navigate('/login')
      }
    } catch (err) {
      console.error('Registration error:', err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={formData.username}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Username"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="userNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                id="userNumber"
                name="userNumber"
                type="tel"
                autoComplete="tel"
                required
                value={formData.userNumber}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Phone Number"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup
```

---

## Step 8: Implement Add to Cart

### 8.1 Update ProductCard Component (`src/components/ProductCard.jsx`)

```javascript
import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../store/slices/cartSlice'
import { useNavigate } from 'react-router-dom'

const ProductCard = ({ product }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const { loading } = useSelector((state) => state.cart)

  const handleAddToCart = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      alert('Please login to add items to cart')
      navigate('/login')
      return
    }

    try {
      const result = await dispatch(addToCart(product._id || product.id))
      
      if (addToCart.fulfilled.match(result)) {
        alert('Product added to cart!')
        // Optionally refetch cart items
        // dispatch(fetchCartItems())
      } else {
        alert(result.payload || 'Failed to add to cart')
      }
    } catch (error) {
      console.error('Add to cart error:', error)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/product/${product._id || product.id}`}>
        <img
          src={product.productImage || product.image || 'https://via.placeholder.com/400x400'}
          alt={product.productName || product.name}
          className="w-full h-64 object-cover"
        />
      </Link>
      <div className="p-4">
        <Link to={`/product/${product._id || product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600">
            {product.productName || product.name}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.productDescription || product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary-600">
            ${product.productPrice || product.price}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={loading}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
```

### 8.2 Update ProductDetail Component (if exists)

Add similar add to cart functionality in your product detail page.

---

## Step 9: Display Cart Items

### 9.1 Update Cart Component (`src/pages/Cart.jsx`)

```javascript
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  fetchCartItems,
  updateCartItem,
  removeFromCart,
} from '../store/slices/cartSlice'

const Cart = () => {
  const dispatch = useDispatch()
  const { items, loading, error, totalItems, totalPrice } = useSelector(
    (state) => state.cart
  )
  const { isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCartItems())
    }
  }, [dispatch, isAuthenticated])

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      return
    }
    await dispatch(updateCartItem({ productId, quantity: newQuantity }))
    // Refetch cart to get updated totals
    dispatch(fetchCartItems())
  }

  const handleRemove = async (productId) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      await dispatch(removeFromCart(productId))
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Please login to view your cart
          </h2>
          <Link
            to="/login"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading cart...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Link
            to="/products"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.product._id}
                className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4"
              >
                <img
                  src={
                    item.product.productImage ||
                    'https://via.placeholder.com/100x100'
                  }
                  alt={item.product.productName}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.product.productName}
                  </h3>
                  <p className="text-gray-600">
                    ${item.product.productPrice}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        handleQuantityChange(item.product._id, item.quantity - 1)
                      }
                      className="w-8 h-8 rounded-md border border-gray-300 hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="w-12 text-center">{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.product._id, item.quantity + 1)
                      }
                      className="w-8 h-8 rounded-md border border-gray-300 hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemove(item.product._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Total Items</span>
                  <span>{totalItems}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <Link
                to="/checkout"
                className="block w-full bg-primary-600 text-white py-3 rounded-md hover:bg-primary-700 transition-colors font-semibold text-center"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
```

---

## Step 10: Protected Routes

### 10.1 Create Protected Route Component (`src/components/ProtectedRoute.jsx`)

```javascript
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
```

### 10.2 Update App.jsx to Use Protected Routes

```javascript
import ProtectedRoute from './components/ProtectedRoute'

// In your Routes:
<Route
  path="/cart"
  element={
    <ProtectedRoute>
      <Cart />
    </ProtectedRoute>
  }
/>
<Route
  path="/checkout"
  element={
    <ProtectedRoute>
      <Checkout />
    </ProtectedRoute>
  }
/>
```

---

## Step 11: Update Navbar to Show User Info

### 11.1 Update Navbar Component (`src/components/Navbar.jsx`)

```javascript
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/slices/authSlice'
import { fetchCartItems } from '../store/slices/cartSlice'

// In your Navbar component:
const { isAuthenticated, user } = useSelector((state) => state.auth)
const { totalItems } = useSelector((state) => state.cart)
const dispatch = useDispatch()

const handleLogout = () => {
  dispatch(logout())
  // Optionally clear cart
  // dispatch(clearCart())
}

// Display user info and cart count in navbar
```

---

## 📝 Backend API Endpoints Reference

### Authentication Endpoints
- **POST** `/api/auth/register` - Register new user
  - Body: `{ username, email, userNumber, password }`
  
- **POST** `/api/auth/login` - Login user
  - Body: `{ email, password }`
  - Returns: `{ message, data, token }`

### Cart Endpoints
- **GET** `/api/cart` - Get cart items (requires auth)
- **POST** `/api/cart/:productId` - Add to cart (requires auth)
- **PATCH** `/api/cart/:productId` - Update quantity (requires auth)
  - Body: `{ quantity }`
- **DELETE** `/api/cart/:productId` - Remove from cart (requires auth)

**Note:** All cart endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## 🎯 Teaching Tips

1. **Start with Redux Concepts**: Explain state management, actions, reducers
2. **Show Redux DevTools**: Install Redux DevTools browser extension
3. **Break Down Async Thunks**: Explain pending/fulfilled/rejected states
4. **Practice with Console Logs**: Add logs to see state changes
5. **Build Incrementally**: Start with login, then signup, then cart
6. **Handle Errors**: Show students how to display error messages
7. **Test Each Step**: Test login before moving to signup, etc.

---

## 🐛 Common Issues & Solutions

### Issue 1: CORS Error
**Solution**: Ensure backend has CORS configured:
```javascript
// In backend app.js
const cors = require('cors')
app.use(cors())
```

### Issue 2: Token Not Persisting
**Solution**: Check localStorage in browser DevTools, ensure token is being saved

### Issue 3: Cart Not Updating
**Solution**: After add/update/delete, refetch cart items:
```javascript
dispatch(addToCart(productId))
dispatch(fetchCartItems()) // Refetch to get updated state
```

### Issue 4: 401 Unauthorized
**Solution**: Check if token is being sent in headers, token might be expired

---

## ✅ Checklist for Students

- [ ] Redux store configured
- [ ] Auth slice created and working
- [ ] Cart slice created and working
- [ ] Login functionality working
- [ ] Signup functionality working
- [ ] Add to cart working
- [ ] Cart page displaying items
- [ ] Protected routes working
- [ ] Logout functionality working
- [ ] Error handling implemented

---

## 📚 Additional Resources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React-Redux Hooks](https://react-redux.js.org/api/hooks)
- [Axios Documentation](https://axios-http.com/docs/intro)

---

**Happy Teaching! 🎓**

