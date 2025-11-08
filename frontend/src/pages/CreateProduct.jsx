import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const CreateProduct = () => {
  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    productPrice: '',
    productStatus: 'available',
    productStockQty: '',
    productImage: null,
  })

  const [previewImage, setPreviewImage] = useState(null)

  const handleChange = (e) => {
    if (e.target.name === 'productImage') {
      const file = e.target.files[0]
      if (file) {
        setFormData({
          ...formData,
          productImage: file,
        })
        // Create preview
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviewImage(reader.result)
        }
        reader.readAsDataURL(file)
      }
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Logic will be added here
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link
          to="/products"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          ← Back to Products
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create New Product
        </h1>
        <p className="text-gray-600 mb-8">
          Add a new product to your store
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <label
              htmlFor="productName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter product name"
              required
            />
          </div>

          {/* Product Description */}
          <div>
            <label
              htmlFor="productDescription"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Product Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="productDescription"
              name="productDescription"
              value={formData.productDescription}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter product description"
              required
            />
          </div>

          {/* Product Price and Stock Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="productPrice"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Product Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="productPrice"
                name="productPrice"
                value={formData.productPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label
                htmlFor="productStockQty"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="productStockQty"
                name="productStockQty"
                value={formData.productStockQty}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0"
                required
              />
            </div>
          </div>

          {/* Product Status */}
          <div>
            <label
              htmlFor="productStatus"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Product Status <span className="text-red-500">*</span>
            </label>
            <select
              id="productStatus"
              name="productStatus"
              value={formData.productStatus}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="available">Available</option>
              <option value="unavilable">Unavailable</option>
            </select>
          </div>

          {/* Product Image */}
          <div>
            <label
              htmlFor="productImage"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Product Image
            </label>
            <input
              type="file"
              id="productImage"
              name="productImage"
              accept="image/jpg,image/jpeg,image/png"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="mt-2 text-sm text-gray-500">
              Accepted formats: JPG, JPEG, PNG
            </p>
            {previewImage && (
              <div className="mt-4">
                <img
                  src={previewImage}
                  alt="Product preview"
                  className="w-48 h-48 object-cover rounded-md border border-gray-300"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              className="flex-1 bg-primary-600 text-white py-3 rounded-md hover:bg-primary-700 transition-colors font-semibold"
            >
              Create Product
            </button>
            <Link
              to="/products"
              className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateProduct

