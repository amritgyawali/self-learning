import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { X, Star } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface QuickViewProps {
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    rating: number;
    reviewCount: number;
    description?: string;
  };
  onClose: () => void;
  onAddToCart: (product: any) => void;
}

const QuickView: React.FC<QuickViewProps> = ({ product, onClose, onAddToCart }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2">
            <Image src={product.image} alt={product.name} width={300} height={300} className="w-full h-auto object-cover rounded-lg" />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
            <div className="flex items-center mb-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm text-gray-600">{product.rating} ({product.reviewCount} reviews)</span>
            </div>
            <p className="text-xl font-semibold mb-4">₹{product.price}</p>
            <p className="text-gray-600 mb-4">{product.description || "No description available."}</p>
            <Button 
              onClick={() => onAddToCart(product)}
              className="w-full bg-[#f5d3d6] text-[#2c2c2c] hover:bg-[#e6b8bc]"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default QuickView

