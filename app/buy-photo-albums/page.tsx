'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Layout from '../components/Layout'
import ProductCard from '../components/ProductCard'
import ShoppingCart from '../components/ShoppingCart'
import QuickView from '../components/QuickView'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Heart, ShoppingCartIcon as CartIcon } from 'lucide-react'
import styles from '../styles/layout.module.css';

// Mock product data
const products = [
  { id: 1, name: 'Premium Wedding Album', price: 2999, image: '/product-album.jpg', category: 'Albums', rating: 4.5, reviewCount: 28, color: 'White', material: 'Leather', size: 'Large', description: 'A luxurious leather-bound album to preserve your wedding memories.' },
  { id: 2, name: 'Elegant Photo Frame', price: 999, image: '/product-frame.jpg', category: 'Frames', rating: 4.2, reviewCount: 15, color: 'Silver', material: 'Wood', size: 'Medium', description: 'A beautifully crafted wooden frame with a silver finish.' },
  { id: 3, name: 'Custom Photo Print', price: 499, image: '/product-print.jpg', category: 'Photos', rating: 4.8, reviewCount: 42, color: 'Multi', material: 'Paper', size: 'Custom', description: 'High-quality custom prints of your favorite photos.' },
  { id: 4, name: 'Wedding Memories Box', price: 1999, image: '/product-box.jpg', category: 'Gifts', rating: 4.6, reviewCount: 33, color: 'Brown', material: 'Wood', size: 'Large', description: 'A handcrafted wooden box to store your wedding keepsakes.' },
]

const BuyPhotoAlbumsPage = () => {
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [priceRange, setPriceRange] = useState([0, 3000])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedColors, setSelectedColors] = useState([])
  const [selectedMaterials, setSelectedMaterials] = useState([])
  const [selectedSizes, setSelectedSizes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [cartItems, setCartItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [sortOption, setSortOption] = useState('')
  const [wishlist, setWishlist] = useState([])
  const [quickViewProduct, setQuickViewProduct] = useState(null)

  useEffect(() => {
    filterProducts()
  }, [priceRange, selectedCategories, selectedColors, selectedMaterials, selectedSizes, searchTerm, sortOption])

  const filterProducts = () => {
    let filtered = products.filter(product => 
      product.price >= priceRange[0] && 
      product.price <= priceRange[1] &&
      (selectedCategories.length === 0 || selectedCategories.includes(product.category)) &&
      (selectedColors.length === 0 || selectedColors.includes(product.color)) &&
      (selectedMaterials.length === 0 || selectedMaterials.includes(product.material)) &&
      (selectedSizes.length === 0 || selectedSizes.includes(product.size)) &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Apply sorting
    switch (sortOption) {
      case 'price-low-high':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high-low':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      // Add more sorting options as needed
    }

    setFilteredProducts(filtered)
  }

  const addToCart = (product) => {
    setCartItems([...cartItems, { ...product, quantity: 1 }])
  }

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, newQuantity) => {
    setCartItems(cartItems.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    ))
  }

  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId))
    } else {
      setWishlist([...wishlist, productId])
    }
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={styles['main-content']}
      >
        {/* Hero Section */}
        <section className="relative h-[60vh]">
         <Image src="/images/photo-albums-hero.jpg" alt="Photo Albums" layout="fill" objectFit="cover" />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white">
            <h1 className="text-4xl md:text-6xl font-serif mb-4 text-center">Preserve Your Precious Memories with Elegance</h1>
            <p className="text-xl mb-6">Explore Our Premium Albums, Frames, and Prints</p>
            <Button 
              onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}
              className="bg-[#f5d3d6] text-[#2c2c2c] hover:bg-[#e6b8bc] transition-all duration-300 transform hover:scale-105"
            >
              Shop Now
            </Button>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar with filters */}
            <aside className="w-full md:w-1/4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-2xl font-serif mb-4">Filters</h2>
                
                <div className="mb-4">
                  <Label htmlFor="search">Search</Label>
                  <Input 
                    id="search"
                    type="text" 
                    placeholder="Search products..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Price Range</h3>
                  <Slider
                    defaultValue={[0, 3000]}
                    max={3000}
                    step={100}
                    onValueChange={setPriceRange}
                  />
                  <div className="flex justify-between mt-2">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Categories</h3>
                  {['Albums', 'Frames', 'Photos', 'Gifts'].map((category, index) => (
                    <div key={`category-${index}`} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`category-${index}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedCategories([...selectedCategories, category])
                          } else {
                            setSelectedCategories(selectedCategories.filter(c => c !== category))
                          }
                        }}
                      />
                      <Label htmlFor={`category-${index}`}>{category}</Label>
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Color</h3>
                  <Select onValueChange={(value) => setSelectedColors([value])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                      {['White', 'Silver', 'Brown', 'Multi'].map((color) => (
                        <SelectItem key={color} value={color}>{color}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Material</h3>
                  <Select onValueChange={(value) => setSelectedMaterials([value])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select material" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Leather', 'Wood', 'Paper'].map((material) => (
                        <SelectItem key={material} value={material}>{material}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Size</h3>
                  <Select onValueChange={(value) => setSelectedSizes([value])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Large', 'Medium', 'Custom'].map((size) => (
                        <SelectItem key={size} value={size}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </aside>

            {/* Product grid */}
            <main className="w-full md:w-3/4" id="products">
              <div className="mb-4 flex justify-between items-center">
                <Select onValueChange={setSortOption}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                    <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Popularity</SelectItem>
                  </SelectContent>
                </Select>
                <p>{filteredProducts.length} products found</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={`product-${product.id}`} 
                    product={product} 
                    onAddToCart={addToCart}
                    onToggleWishlist={() => toggleWishlist(product.id)}
                    isWishlisted={wishlist.includes(product.id)}
                    onQuickView={() => setQuickViewProduct(product)}
                  />
                ))}
              </div>
            </main>
          </div>
        </div>

        {/* Shopping Cart */}
        <ShoppingCart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onRemove={removeFromCart}
          onUpdateQuantity={updateQuantity}
        />

        {/* Quick View Modal */}
        <AnimatePresence>
          {quickViewProduct && (
            <QuickView
              product={quickViewProduct}
              onClose={() => setQuickViewProduct(null)}
              onAddToCart={addToCart}
            />
          )}
        </AnimatePresence>

        {/* Cart Icon */}
        <button
          className={`fixed bottom-4 right-4 bg-[#f5d3d6] text-[#2c2c2c] p-4 rounded-full shadow-lg flex items-center justify-center ${styles['cart-button']}`}
          onClick={() => setIsCartOpen(true)}
        >
          <CartIcon className="w-6 h-6 mr-2" />
          <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
        </button>

        {/* FAQ Section */}
        <section className="bg-gray-100 py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-serif text-center mb-8">Frequently Asked Questions</h2>
            {/* Add FAQ content here */}
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-serif text-center mb-8">What Our Customers Say</h2>
            {/* Add testimonial slider here */}
          </div>
        </section>
      </motion.div>
    </Layout>
  )
}

export default BuyPhotoAlbumsPage

