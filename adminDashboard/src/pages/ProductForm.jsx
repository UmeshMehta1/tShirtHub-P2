import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { createProduct, updateProductData, fetchSingleProduct } from '../store/adminProductSlice'
import { STATUSES } from '../statues/statuses'

const ProductForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { product, status } = useSelector((state) => state.adminProduct)
  const isEdit = !!id

  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    productPrice: '',
    productStatus: 'active',
    productStockQty: '',
  })
  const [productImage, setProductImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchSingleProduct(id))
    }
  }, [dispatch, id, isEdit])

  useEffect(() => {
    if (isEdit && product) {
      setFormData({
        productName: product.productName || '',
        productDescription: product.productDescription || '',
        productPrice: product.productPrice || '',
        productStatus: product.productStatus || 'active',
        productStockQty: product.productStockQty || '',
      })
      if (product.productImage) {
        setImagePreview(`http://localhost:3000/upload/${product.productImage}`)
      }
    }
  }, [product, isEdit])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProductImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.productName || !formData.productDescription || !formData.productPrice || !formData.productStockQty) {
      alert('Please fill in all required fields')
      return
    }

    const submitData = new FormData()
    submitData.append('productName', formData.productName)
    submitData.append('productDescription', formData.productDescription)
    submitData.append('productPrice', formData.productPrice)
    submitData.append('productStatus', formData.productStatus)
    submitData.append('productStockQty', formData.productStockQty)
    if (productImage) {
      submitData.append('productImage', productImage)
    }

    let result
    if (isEdit) {
      result = await dispatch(updateProductData(id, submitData))
    } else {
      result = await dispatch(createProduct(submitData))
    }

    if (result.success) {
      alert(isEdit ? 'Product updated successfully' : 'Product created successfully')
      navigate('/admin/products')
    } else {
      alert(result.error || 'Failed to save product')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? 'Edit Product' : 'Create New Product'}
        </h1>
        <p className="mt-2 text-gray-600">
          {isEdit ? 'Update product information' : 'Add a new product to your inventory'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
            Product Name *
          </label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            id="productDescription"
            name="productDescription"
            value={formData.productDescription}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Price (RS) *
            </label>
            <input
              type="number"
              id="productPrice"
              name="productPrice"
              value={formData.productPrice}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label htmlFor="productStockQty" className="block text-sm font-medium text-gray-700 mb-1">
              Stock Quantity *
            </label>
            <input
              type="number"
              id="productStockQty"
              name="productStockQty"
              value={formData.productStockQty}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="productStatus" className="block text-sm font-medium text-gray-700 mb-1">
            Status *
          </label>
          <select
            id="productStatus"
            name="productStatus"
            value={formData.productStatus}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label htmlFor="productImage" className="block text-sm font-medium text-gray-700 mb-1">
            Product Image {isEdit && '(Leave empty to keep current image)'}
          </label>
          <input
            type="file"
            id="productImage"
            name="productImage"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
          {imagePreview && (
            <div className="mt-2">
              <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded" />
            </div>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={status === STATUSES.LOADING}
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === STATUSES.LOADING ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProductForm

