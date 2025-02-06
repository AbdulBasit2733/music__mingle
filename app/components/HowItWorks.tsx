"use client"

import { motion } from "framer-motion"

const steps = [
  {
    number: "01",
    title: "Create Your Stream",
    description: "Set up your streaming channel and connect it to FanTune.",
  },
  {
    number: "02",
    title: "Invite Your Fans",
    description: "Share your unique FanTune link with your audience.",
  },
  {
    number: "03",
    title: "Let Them Choose",
    description: "Fans vote on songs from your curated playlist or suggest their own.",
  },
  {
    number: "04",
    title: "Enjoy the Show",
    description: "Stream with a playlist shaped by your community in real-time.",
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="text-5xl font-bold text-purple-500 mb-4">{step.number}</div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

