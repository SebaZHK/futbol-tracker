// app/profile/page.tsx
'use client'

import PlayerProfile from '@/components/PlayerProfile'

export default function ProfilePage() {
  return (
    <div className="space-y-6 py-8">
      <h1 className="text-3xl font-bold text-code-cyan text-center">
        Mi Perfil
      </h1>
      <PlayerProfile />
    </div>
  )
}
