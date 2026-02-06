import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

function getSupabase(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) return null
  return createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = getSupabase()

export const isSupabaseConfigured = (): boolean => !!supabase

// Types for attendance records
export interface AttendanceRecord {
  id: string
  user_id: string
  check_in: string
  check_out: string | null
  created_at?: string
}

// Get attendance records for a user
export async function getAttendanceRecords(userId: string) {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('user_id', userId)
    .order('check_in', { ascending: false })

  if (error) {
    console.error('Error fetching attendance records:', error)
    return []
  }

  return data as AttendanceRecord[]
}

// Clock in
export async function clockIn(userId: string) {
  if (!supabase) throw new Error('Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local')
  const { data, error } = await supabase
    .from('attendance')
    .insert([
      {
        user_id: userId,
        check_in: new Date().toISOString(),
        check_out: null,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error('Error clocking in:', error)
    throw error
  }

  return data as AttendanceRecord
}

// Clock out
export async function clockOut(attendanceId: string) {
  if (!supabase) throw new Error('Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local')
  const { data, error } = await supabase
    .from('attendance')
    .update({ check_out: new Date().toISOString() })
    .eq('id', attendanceId)
    .select()
    .single()

  if (error) {
    console.error('Error clocking out:', error)
    throw error
  }

  return data as AttendanceRecord
}

// Get active clock-in (if user hasn't clocked out)
export async function getActiveClockIn(userId: string) {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('user_id', userId)
    .is('check_out', null)
    .order('check_in', { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching active clock-in:', error)
    return null
  }

  return data as AttendanceRecord | null
}
