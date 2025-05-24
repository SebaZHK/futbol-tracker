// components/Navbar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/profile', label: 'Perfil' },
  { href: '/matches', label: 'Partidos' },
  { href: '/stats', label: 'Estadísticas' },
  { href: '/training', label: 'Entrenamiento' },
  { href: '/tournaments', label: 'Torneos' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow p-4 mb-6">
      <ul className="flex gap-4">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className={clsx(
                'text-sm font-medium',
                pathname === href ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              )}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
