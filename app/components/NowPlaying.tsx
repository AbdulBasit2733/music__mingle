"use client"

import { motion } from "framer-motion"
import { Play, SkipForward, SkipBack } from "lucide-react"
import { Button } from "@/components/ui/button"

const NowPlaying = () => {
  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-lg border-t border-gray-800 p-4"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 1.5, duration: 0.5 }}
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src="https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg"
            alt="Now Playing"
            className="w-16 h-16 object-cover rounded-md"
          />
          <div>
            <h3 className="font-medium text-gray-200">Currently Playing Song</h3>
            <p className="text-sm text-gray-400">Artist Name</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="hover:text-purple-400 transition-colors duration-300">
            <SkipBack className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:text-purple-400 transition-colors duration-300">
            <Play className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:text-purple-400 transition-colors duration-300">
            <SkipForward className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default NowPlaying

