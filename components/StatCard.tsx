// components/StatCard.tsx
'use client'

import React from 'react'

type StatCardProps = {
  label: string
  value: number
}

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="bg-graphite-light p-4 rounded-xl shadow-md text-center w-full sm:w-48">
      <p className="text-sm text-soft-blush">{label}</p>
      <p className="text-2xl font-bold text-code-cyan mt-1">{value}</p>
    </div>
  )
}
