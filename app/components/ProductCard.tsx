import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Heart, Star, Eye } from 'lucide-react'

interface Product {
  id: number;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  price: number;
}

interface ProductCardProps {
  isInCart: boolean;
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (id: number) => void;
  isWishlisted: boolean;
  onQuickView: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onToggleWishlist, isWishlisted, onQuickView,isInCart }) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <Image src={product.image} alt={product.name} width={300} height={300} className="w-full h-48 object-cover" />
        <button
          onClick={() => onToggleWishlist(product.id)}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md"
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <div className="flex items-center mb-2">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="ml-1 text-sm text-gray-600">{product.rating} ({product.reviewCount} reviews)</span>
        </div>
        <p className="text-gray-600 mb-4">₹{product.price}</p>
        <div className="flex justify-between flex-wrap items-center">
          {isInCart ? <Button>Added To Cart</Button>:
          <Button 
            onClick={() => onAddToCart(product)}
            className="bg-[#f5d3d6] text-[#2c2c2c] hover:bg-[#e6b8bc]"
          >
            Add to Cart
          </Button>}
          <Button
            onClick={() => onQuickView(product)}
            variant="outline"
            className=""
          >
            <Eye className="w-4 h-4 mr-2" />
            Quick View
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard

