'use client'

import { useEffect, useState } from 'react'
import StatCard from '@/components/StatCard'

type Match = {
  id: string
  date: string
  opponent: string
  goals: number
  assists: number
  minutes: number
}

export default function DashboardPage() {
  const [matches, setMatches] = useState<Match[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('matches')
    if (stored) setMatches(JSON.parse(stored))
  }, [])

  const totalGoals = matches.reduce((sum, m) => sum + m.goals, 0)
  const totalAssists = matches.reduce((sum, m) => sum + m.assists, 0)
  const totalMatches = matches.length
  const totalMinutes = matches.reduce((sum, m) => sum + m.minutes, 0)

  const stats = [
    { label: 'Goles', value: totalGoals },
    { label: 'Asistencias', value: totalAssists },
    { label: 'Partidos', value: totalMatches },
    { label: 'Minutos', value: totalMinutes },
    // { label: 'G/A', value: totalGoals + totalAssists},
    // { label: 'Minutos promedios por partido', value: totalMinutes/totalMatches},
    // { label: 'Promedio de goles por partido', value: totalGoals/totalMatches},
    // { label: 'Promedio de asist por partido', value: totalAssists/totalMatches},
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="flex flex-wrap gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </div>
    </div>
  )
}
