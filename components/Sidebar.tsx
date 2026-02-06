'use client'

import { motion } from 'framer-motion'
import { LayoutDashboard, History, Settings } from 'lucide-react'
interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="w-64 p-6 border-r border-white/20">
      <h2 className="text-xl font-semibold mb-8 text-gray-800">Attendance</h2>
      <nav className="space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-white/50 text-gray-900 shadow-lg'
                  : 'text-gray-700 hover:bg-white/30'
              }`}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon size={20} />
              <span className="font-medium">{tab.label}</span>
            </motion.button>
          )
        })}
      </nav>
    </div>
  )
}
