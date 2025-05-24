'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-graphite p-6">
      {/* Hero Section */}
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-extrabold text-code-cyan mb-4">
          Mi Fútbol Tracker
        </h1>
        <p className="text-lg text-soft-blush mb-8">
          Tu compañera de equipo para estadísticas y entrenamientos
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="btn-primary"
          >
            Comienza ahora
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-16 bg-night-black w-full py-12">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: '📊', title: 'Dashboard intuitivo', desc: 'Ve tus goles, asistencias y minutos de manera clara.' },
            { icon: '⚽', title: 'Registro inmediato', desc: 'Añade partidos y entrenos al instante.' },
            { icon: '🏃', title: 'Plan de entrenamiento', desc: 'Lleva un seguimiento de tus rutinas.' },
            { icon: '🏆', title: 'Torneos y rankings', desc: 'Organiza y compite con tu equipo.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center px-4">
              <span className="text-4xl text-code-cyan">{icon}</span>
              <h3 className="mt-4 text-xl font-semibold text-soft-blush">{title}</h3>
              <p className="mt-2 text-soft-blush text-center">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}