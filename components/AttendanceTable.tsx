'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, LogOut } from 'lucide-react'

interface AttendanceRecord {
  id: string
  check_in: string
  check_out: string | null
}

interface AttendanceTableProps {
  records: AttendanceRecord[]
}

export default function AttendanceTable({ records }: AttendanceTableProps) {
  const calculateHours = (checkIn: string, checkOut: string | null) => {
    if (!checkOut) return '-'
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diff = end.getTime() - start.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      }),
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass rounded-3xl p-6 shadow-2xl"
    >
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">Attendance History</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/20">
              <th className="text-left py-4 px-4 text-gray-700 font-semibold">Date</th>
              <th className="text-left py-4 px-4 text-gray-700 font-semibold">Check-in Time</th>
              <th className="text-left py-4 px-4 text-gray-700 font-semibold">Check-out Time</th>
              <th className="text-left py-4 px-4 text-gray-700 font-semibold">Total Hours</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  No attendance records found
                </td>
              </tr>
            ) : (
              records.map((record, index) => {
                const checkIn = formatDateTime(record.check_in)
                const checkOut = record.check_out
                  ? formatDateTime(record.check_out)
                  : null

                return (
                  <motion.tr
                    key={record.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/10 hover:bg-white/30 transition-colors"
                    whileHover={{ y: -2 }}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-gray-800">
                        <Calendar size={16} className="text-gray-500" />
                        {checkIn.date}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-gray-800">
                        <Clock size={16} className="text-blue-500" />
                        {checkIn.time}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {checkOut ? (
                        <div className="flex items-center gap-2 text-gray-800">
                          <LogOut size={16} className="text-red-500" />
                          {checkOut.time}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Not clocked out</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-gray-800 font-medium">
                      {calculateHours(record.check_in, record.check_out)}
                    </td>
                  </motion.tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
