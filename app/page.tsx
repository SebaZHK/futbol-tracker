// app/page.tsx
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-3xl font-bold mb-4">Bienvenido a Mi Fútbol Tracker ⚽</h1>
      <p className="text-lg text-gray-600 mb-6">
        Registra tus partidos, entrenamientos y estadísticas de forma fácil y personalizada.
      </p>
      <a href="/login" className="text-blue-600 underline">
        Iniciar sesión
      </a>
    </div>
  )
}
