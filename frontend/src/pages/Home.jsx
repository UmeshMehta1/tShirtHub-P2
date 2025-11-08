import React from 'react'
import Hero from '../components/Hero'
import ProductCard from '../components/ProductCard'

const Home = () => {
  // Sample products for display
  const featuredProducts = [
    {
      id: 1,
      name: 'Classic White T-Shirt',
      price: '29.99',
      originalPrice: '39.99',
      discount: 25,
      image: 'https://via.placeholder.com/400x400',
      rating: 5,
    },
    {
      id: 2,
      name: 'Black Premium Tee',
      price: '34.99',
      image: 'https://via.placeholder.com/400x400',
      rating: 4,
    },
    {
      id: 3,
      name: 'Blue Casual Shirt',
      price: '27.99',
      originalPrice: '35.99',
      discount: 22,
      image: 'https://via.placeholder.com/400x400',
      rating: 5,
    },
    {
      id: 4,
      name: 'Gray Comfort Fit',
      price: '31.99',
      image: 'https://via.placeholder.com/400x400',
      rating: 4,
    },
  ]

  return (
    <div>
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium t-shirts
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home

