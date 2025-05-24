// app/dashboard/layout.tsx
import LogoutButton from '@/components/LogoutButton'
import { ReactNode } from 'react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen p-6">
      {/* <header className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Mi Fútbol Tracker</h1>
        <LogoutButton />
      </header> */}
      <main>{children}</main>
    </div>
  )
}
