import React from 'react'
import { Link } from 'react-router-dom'

const ProductCard = ({ product }) => {

  return (

    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link to={`/product/${product?.id || 1}`}>
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
        <Link to={`/product/${product?.id || 1}`}>
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
          {/* <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < (product?.rating || 4)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div> */}
        </div>
        <button className="mt-4 w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 transition-colors font-medium">
          Add to Cart
        </button>
      </div>
    </div>
  )
}

export default ProductCard

