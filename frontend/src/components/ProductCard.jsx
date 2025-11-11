import React from 'react'
import { Link } from 'react-router-dom'

const ProductCard = ({ product }) => {
  // Add to cart functionality - students will implement this
  const handleAddToCart = () => {
    // Logic will be added here by students
    console.log('Add to cart clicked for product:', product?._id || product?.id)
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link to={`/product/${product?._id || product?.id || 1}`}>
        <div className="relative">
          <img
            src={product?.productImage || 'https://via.placeholder.com/400x400'}
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
          
          className="mt-4 w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 transition-colors font-medium"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}

export default ProductCard

