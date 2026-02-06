'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '@/components/Sidebar'
import ClockInCard from '@/components/ClockInCard'
import AttendanceTable from '@/components/AttendanceTable'
import TrafficLights from '@/components/TrafficLights'
import {
  getAttendanceRecords,
  clockIn,
  clockOut,
  getActiveClockIn,
  isSupabaseConfigured,
  type AttendanceRecord,
} from '@/lib/supabase'

// Temporary user ID - in production, get this from authentication
const USER_ID = 'user-1'

export default function Home() {
  const [activeTab, setActiveTab] = useState('overview')
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [isClockedIn, setIsClockedIn] = useState(false)
  const [activeRecordId, setActiveRecordId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [records, active] = await Promise.all([
        getAttendanceRecords(USER_ID),
        getActiveClockIn(USER_ID),
      ])
      setAttendanceRecords(records)
      setIsClockedIn(!!active)
      setActiveRecordId(active?.id || null)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClockIn = async () => {
    try {
      const record = await clockIn(USER_ID)
      setIsClockedIn(true)
      setActiveRecordId(record.id)
      await loadData()
    } catch (error: unknown) {
      console.error('Error clocking in:', error)
      const message = error && typeof error === 'object' && 'message' in error
        ? String((error as { message: string }).message)
        : 'Failed to clock in. Please try again.'
      alert(message)
    }
  }

  const handleClockOut = async () => {
    if (!activeRecordId) return

    try {
      await clockOut(activeRecordId)
      setIsClockedIn(false)
      setActiveRecordId(null)
      await loadData()
    } catch (error: unknown) {
      console.error('Error clocking out:', error)
      const message = error && typeof error === 'object' && 'message' in error
        ? String((error as { message: string }).message)
        : 'Failed to clock out. Please try again.'
      alert(message)
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <ClockInCard
              isClockedIn={isClockedIn}
              onClockIn={handleClockIn}
              onClockOut={handleClockOut}
            />
            <AttendanceTable records={attendanceRecords.slice(0, 5)} />
          </div>
        )
      case 'history':
        return <AttendanceTable records={attendanceRecords} />
      case 'settings':
        return (
          <div className="glass rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Settings</h3>
            <p className="text-gray-600">Settings panel coming soon...</p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <main className="min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 20,
        }}
        className="max-w-7xl mx-auto glass rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* macOS Traffic Lights */}
        <div className="flex items-center border-b border-white/20">
          <TrafficLights />
          <div className="flex-1 text-center text-sm text-gray-500 font-medium">
            Attendance Management System
          </div>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>

        <div className="flex min-h-[600px]">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="flex-1 p-8">
            {!isSupabaseConfigured() && (
              <div className="mb-6 glass rounded-2xl p-4 border-amber-200/50 bg-amber-50/80 text-amber-900 text-sm">
                <strong>Supabase not configured.</strong> Copy <code className="bg-white/50 px-1 rounded">.env.local.example</code> to <code className="bg-white/50 px-1 rounded">.env.local</code> and add <code className="bg-white/50 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="bg-white/50 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>. Restart the dev server after saving.
              </div>
            )}
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-600">Loading...</div>
              </div>
            ) : (
              renderContent()
            )}
          </div>
        </div>
      </motion.div>
    </main>
  )
}
