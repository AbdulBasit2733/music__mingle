"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import type React from "react" // Added import for React

const AddToQueue = () => {
  const [url, setUrl] = useState("")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a YouTube URL",
        variant: "destructive",
      })
      return
    }
    // TODO: Add video to queue
    
    toast({
      title: "Success",
      description: "Video added to queue",
    })
    setUrl("")
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl mx-auto space-y-4 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
    >
      <div className="flex gap-2">
        <Input
          type="url"
          placeholder="Paste YouTube URL here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="bg-gray-800/50 border-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 transition-all duration-300"
        />
        <Button type="submit" className="bg-purple-600 hover:bg-purple-700 transition-colors duration-300">
          <Plus className="mr-2 h-4 w-4" />
          Add to Queue
        </Button>
      </div>
    </motion.form>
  )
}

export default AddToQueue

