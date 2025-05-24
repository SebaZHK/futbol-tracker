// app/page.tsx
'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-6">
      {/* Hero Section */}
      <div className="max-w-2xl">
        <h1 className="text-5xl font-extrabold text-blue-900 mb-4">
          Mi Fútbol Tracker
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Tu compañera de equipo para estadísticas y entrenamientos
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700"
          >
            Comienza ahora
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-16 bg-gray-50 w-full py-12">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-center px-4">
            <span className="text-4xl">📊</span>
            <h3 className="mt-4 text-xl font-semibold">Dashboard intuitivo</h3>
            <p className="mt-2 text-gray-600 text-center">
              Ve tus goles, asistencias y minutos de manera clara.
            </p>
          </div>
          <div className="flex flex-col items-center px-4">
            <span className="text-4xl">⚽</span>
            <h3 className="mt-4 text-xl font-semibold">Registro inmediato</h3>
            <p className="mt-2 text-gray-600 text-center">
              Añade partidos y entrenos al instante.
            </p>
          </div>
          <div className="flex flex-col items-center px-4">
            <span className="text-4xl">🏃</span>
            <h3 className="mt-4 text-xl font-semibold">Plan de entrenamiento</h3>
            <p className="mt-2 text-gray-600 text-center">
              Lleva un seguimiento de tus rutinas.
            </p>
          </div>
          <div className="flex flex-col items-center px-4">
            <span className="text-4xl">🏆</span>
            <h3 className="mt-4 text-xl font-semibold">Torneos y rankings</h3>
            <p className="mt-2 text-gray-600 text-center">
              Organiza y compite con tu equipo.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}