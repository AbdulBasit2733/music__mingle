"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function CTA() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Revolutionize Your Streams?</h2>
          <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Join FanTune today and start creating unforgettable, interactive music experiences with your fans.
          </p>
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
            Get Started for Free
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

