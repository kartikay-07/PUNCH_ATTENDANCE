'use client'

import { motion } from 'framer-motion'

export default function TrafficLights() {
  return (
    <div className="flex items-center gap-2 px-4 py-3">
      <motion.div
        className="w-3 h-3 rounded-full bg-red-500"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      />
      <motion.div
        className="w-3 h-3 rounded-full bg-yellow-500"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      />
      <motion.div
        className="w-3 h-3 rounded-full bg-green-500"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      />
    </div>
  )
}
