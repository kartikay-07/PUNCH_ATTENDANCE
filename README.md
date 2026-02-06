# macOS Glass Attendance System (PUNCH_ATTENDANCE)

Note punch in and punch out time. A beautiful, high-fidelity macOS-style Attendance Management System built with Next.js, Tailwind CSS, Framer Motion, and Supabase.

## Features

- 🎨 **macOS Glassmorphism Design** - Beautiful glass-like UI with backdrop blur effects
- ⏰ **Real-time Clock** - Live digital clock display
- 📊 **Attendance Tracking** - Clock in/out functionality with history
- 🎭 **Smooth Animations** - Framer Motion powered micro-interactions
- 📱 **Responsive Layout** - Works on all screen sizes
- 🚦 **macOS Traffic Lights** - Authentic macOS window controls

## Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- Supabase attendance table set up (see below)

## Supabase Setup

Before running the app, set up the database in the **Supabase Dashboard → SQL Editor**.

**1. Create the `attendance` table:**

```sql
CREATE TABLE attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  check_in TIMESTAMPTZ NOT NULL,
  check_out TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**2. Allow the app to read/write (Row Level Security):**

Supabase enables RLS by default. Add policies so the anon key can insert and select:

```sql
-- Allow anyone to insert a row (clock in)
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon insert" ON attendance
  FOR INSERT TO anon WITH CHECK (true);

-- Allow anyone to select (view history)
CREATE POLICY "Allow anon select" ON attendance
  FOR SELECT TO anon USING (true);

-- Allow anyone to update (clock out)
CREATE POLICY "Allow anon update" ON attendance
  FOR UPDATE TO anon USING (true) WITH CHECK (true);
```

Run both SQL blocks in your project, then try **Punch In** again.

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Supabase URL and anon key

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main dashboard page
│   └── globals.css         # Global styles
├── components/
│   ├── TrafficLights.tsx   # macOS traffic light buttons
│   ├── Sidebar.tsx         # Navigation sidebar
│   ├── ClockInCard.tsx     # Clock-in widget
│   └── AttendanceTable.tsx # Attendance history table
└── lib/
    └── supabase.ts         # Supabase client and functions
```

## Customization

- **User ID**: Currently hardcoded as `'user-1'` in `app/page.tsx`. Replace with your authentication system.
- **Styling**: Modify Tailwind classes in components to adjust colors, spacing, and effects.
- **Animations**: Adjust Framer Motion props in components for different animation behaviors.

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animation library
- **Supabase** - Backend database
- **Lucide React** - Icon library

## License

MIT
