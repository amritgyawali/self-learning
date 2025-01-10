import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const ShoppingCart = ({ isOpen, onClose, items, onRemove, onUpdateQuantity }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ duration: 0.3 }}
          className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-lg p-6 overflow-y-auto"
        >
          <h2 className="text-2xl font-serif mb-4">Your Cart</h2>
          {items.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              {items.map((item) => (
                <div key={`cart-item-${item.id}`} className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-600">₹{item.price}</p>
                  </div>
                  <div className="flex items-center">
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value))}
                      className="w-16 mr-2"
                    />
                    <Button onClick={() => onRemove(item.id)} variant="destructive">
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <div className="mt-4 border-t pt-4">
                <p className="text-xl font-semibold">Total: ₹{total}</p>
                <Button className="w-full mt-4 bg-[#f5d3d6] text-[#2c2c2c] hover:bg-[#e6b8bc]">
                  Proceed to Checkout
                </Button>
              </div>
            </>
          )}
          <Button onClick={onClose} className="mt-4">
            Close
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ShoppingCart

