import React, { useState } from 'react'
import ProductCard from '../components/ProductCard'

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('default')
  const [priceRange, setPriceRange] = useState('all')

  // Sample products
  const allProducts = [
    {
      id: 1,
      name: 'Classic White T-Shirt',
      price: '29.99',
      originalPrice: '39.99',
      discount: 25,
      category: 'casual',
      image: 'https://via.placeholder.com/400x400',
      rating: 5,
    },
    {
      id: 2,
      name: 'Black Premium Tee',
      price: '34.99',
      category: 'premium',
      image: 'https://via.placeholder.com/400x400',
      rating: 4,
    },
    {
      id: 3,
      name: 'Blue Casual Shirt',
      price: '27.99',
      originalPrice: '35.99',
      discount: 22,
      category: 'casual',
      image: 'https://via.placeholder.com/400x400',
      rating: 5,
    },
    {
      id: 4,
      name: 'Gray Comfort Fit',
      price: '31.99',
      category: 'comfort',
      image: 'https://via.placeholder.com/400x400',
      rating: 4,
    },
    {
      id: 5,
      name: 'Red Sporty Tee',
      price: '36.99',
      category: 'sports',
      image: 'https://via.placeholder.com/400x400',
      rating: 5,
    },
    {
      id: 6,
      name: 'Green Eco-Friendly',
      price: '39.99',
      category: 'eco',
      image: 'https://via.placeholder.com/400x400',
      rating: 4,
    },
    {
      id: 7,
      name: 'Navy Blue Classic',
      price: '28.99',
      originalPrice: '38.99',
      discount: 26,
      category: 'casual',
      image: 'https://via.placeholder.com/400x400',
      rating: 5,
    },
    {
      id: 8,
      name: 'Orange Vibrant Tee',
      price: '32.99',
      category: 'casual',
      image: 'https://via.placeholder.com/400x400',
      rating: 4,
    },
  ]

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'casual', label: 'Casual' },
    { value: 'premium', label: 'Premium' },
    { value: 'sports', label: 'Sports' },
    { value: 'comfort', label: 'Comfort' },
    { value: 'eco', label: 'Eco-Friendly' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
        <p className="text-gray-600">Browse our complete collection</p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Search Products
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label
              htmlFor="sort"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Sort By
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="default">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'All Prices' },
              { value: '0-25', label: 'Under $25' },
              { value: '25-35', label: '$25 - $35' },
              { value: '35-50', label: '$35 - $50' },
              { value: '50+', label: 'Over $50' },
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => setPriceRange(range.value)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  priceRange === range.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {allProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <nav className="flex space-x-2">
          <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            Previous
          </button>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-md">
            1
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            2
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            3
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            Next
          </button>
        </nav>
      </div>
    </div>
  )
}

export default Products

