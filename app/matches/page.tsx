// app/page.tsx
import MatchForm from '@/components/MatchForm'

export default function MatchesPage() {
  return (
    <div className="space-y-6 py-8">
      <h1 className="text-3xl font-bold text-code-cyan text-center">Partidos</h1>
      <MatchForm />
    </div>
  )
}
