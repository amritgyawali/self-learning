'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { mockBackend } from '@/lib/mockBackend'

export default function CommentsPage() {
  const [comments, setComments] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchComments()
  }, [])

  const fetchComments = async () => {
    setIsLoading(true)
    try {
      const fetchedComments = await mockBackend.getComments()
      setComments(fetchedComments)
    } catch (error) {
      console.error('Failed to fetch comments:', error)
    }
    setIsLoading(false)
  }

  const handleDeleteComment = async (id) => {
    try {
      await mockBackend.deleteComment(id)
      fetchComments()
    } catch (error) {
      console.error('Failed to delete comment:', error)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Comment Management</h2>
      </div>

      <div className="space-y-4">
        {comments.map((comment, index) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold mb-1">{comment.user}</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                    <p>{comment.content}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteComment(comment.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

