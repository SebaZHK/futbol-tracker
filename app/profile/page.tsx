// app/profile/page.tsx
import PlayerProfile from '@/components/PlayerProfile'

export default function ProfilePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Perfil</h1>
      <PlayerProfile />
    </div>
  )
}
