"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function Hero() {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24">
      <div className="container mx-auto px-4 text-center">
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Let Your Fans Choose the Beat
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Engage your audience like never before. With FanTune, your fans decide what plays next on your stream.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white mr-4">
            Get Started
          </Button>
          <Button size="lg" variant="outline" className="text-purple-400 border-purple-400 hover:bg-purple-400/10">
            Learn More
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

