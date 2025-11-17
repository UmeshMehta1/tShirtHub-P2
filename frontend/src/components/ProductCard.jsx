import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, fetchCartItems } from '../store/cartSlice'
import { STATUSES } from '../statues/statuses'

const ProductCard = ({ product }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.auth)
  // Local loading state for this specific product card
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async (e) => {
    // Prevent event propagation to avoid triggering Link navigation
    e.preventDefault()
    e.stopPropagation()
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      alert('Please login to add items to cart')
      navigate('/login')
      return
    }

    // Get product ID
    const productId = product?._id || product?.id
    
    if (!productId) {
      alert('Product ID not found')
      return
    }

    // Set local loading state
    setIsAdding(true)

    try {
      // Add product to cart
      const result = await dispatch(addToCart(productId))
      
      // Check if add was successful
      if (result && result.type !== 'cart/addToCart/rejected') {
        // Fetch updated cart items to refresh the cart
        await dispatch(fetchCartItems())
        
        // Product added successfully
        alert('Product added to cart!')
      } else {
        alert('Failed to add product to cart')
      }
    } catch (error) {
      console.error('Add to cart error:', error)
      alert('Failed to add product to cart')
    } finally {
      // Reset local loading state
      setIsAdding(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link to={`/product/${product?._id || product?.id || 1}`}>
        <div className="relative">
          <img
            src={product?.productImage ? `http://localhost:3000/upload/${product.productImage}` : 'https://via.placeholder.com/400x400'}
            alt={product?.productName || 'T-Shirt'}
            className="w-full h-64 object-cover"
          />
          {product?.discount && (
            <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
              {product.discount}% OFF
            </span>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/product/${product?._id || product?.id || 1}`}>
          <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-primary-600 transition-colors">
            {product?.productName || 'Premium T-Shirt'}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product?.productDescription ||
            'Comfortable and stylish t-shirt made with premium quality fabric.'}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
           RS. {product?.productPrice}
            
          </div>
        </div>
        <button 
          onClick={handleAddToCart}
          disabled={isAdding}
          className="mt-4 w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
        >
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}

export default ProductCard

