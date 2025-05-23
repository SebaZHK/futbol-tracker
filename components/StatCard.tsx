// components/StatCard.tsx
import React from 'react'

type StatCardProps = {
  label: string
  value: number
}

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow text-center w-full sm:w-48">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-blue-600">{value}</p>
    </div>
  )
}
