'use client'

import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import { useState, useEffect } from 'react'

interface ClockInCardProps {
  isClockedIn: boolean
  onClockIn: () => void
  onClockOut: () => void
}

export default function ClockInCard({
  isClockedIn,
  onClockIn,
  onClockOut,
}: ClockInCardProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      className="glass rounded-3xl p-8 shadow-2xl"
    >
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Clock className="text-gray-600" size={24} />
          <h3 className="text-2xl font-semibold text-gray-800">Current Time</h3>
        </div>
        <div className="text-6xl font-bold text-gray-900 mb-2 font-mono">
          {formatTime(currentTime)}
        </div>
        <div className="text-lg text-gray-600">{formatDate(currentTime)}</div>
      </div>

      <motion.button
        onClick={isClockedIn ? onClockOut : onClockIn}
        className={`w-full py-6 rounded-2xl text-xl font-semibold text-white shadow-xl ${
          isClockedIn
            ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {isClockedIn ? 'Punch Out' : 'Punch In'}
      </motion.button>
    </motion.div>
  )
}
