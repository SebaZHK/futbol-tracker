// app/tournaments/page.tsx
import TournamentManager from '@/components/TournamentManager'

export default function TournamentsPage() {
  return (
    <div className="space-y-6 py-8">
      <h1 className="text-3xl font-bold text-code-cyan text-center">Torneos</h1>
      <TournamentManager />
    </div>
  )
}
