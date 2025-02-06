"use client"

import { motion } from "framer-motion"
import { Music, Users, Zap } from "lucide-react"

const features = [
  {
    icon: <Music size={32} />,
    title: "Fan-Powered Playlists",
    description: "Let your audience vote on the next track, creating a truly interactive music experience.",
  },
  {
    icon: <Users size={32} />,
    title: "Community Building",
    description: "Foster a sense of community as fans collaborate on the perfect soundtrack for your stream.",
  },
  {
    icon: <Zap size={32} />,
    title: "Real-time Engagement",
    description: "Watch your engagement soar as listeners actively participate in shaping your content.",
  },
]

export default function Features() {
  return (
    <section id="features" className="py-16 md:py-24 bg-gray-800/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Why Choose FanTune?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-gray-700/50 p-6 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="text-purple-500 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

