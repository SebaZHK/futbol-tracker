// app/page.tsx
import StatCard from '@/components/StatCard'

export default function DashboardPage() {
  // Valores abiertos a cambios en un futuro
  const stats = [
    { label: 'Goles', value: 5 },
    { label: 'Asistencias', value: 3 },
    { label: 'Partidos', value: 7 },
    { label: 'Minutos jugados', value: 310 },
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
