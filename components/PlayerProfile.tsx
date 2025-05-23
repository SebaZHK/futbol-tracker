// components/PlayerProfile.tsx
'use client'

import { useState } from 'react'

export default function PlayerProfile() {
  const [name, setName] = useState('Nombre')
  const [position, setPosition] = useState('Posición')
  const [foot, setFoot] = useState('Derecha')
  const [speed, setSpeed] = useState(30)

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Perfil del Jugador</h2>

      <label className="block mb-2">
        Nombre:
        <input
          type="text"
          className="mt-1 w-full p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <label className="block mb-2">
        Posición:
        <input
          type="text"
          className="mt-1 w-full p-2 border rounded"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        />
      </label>

      <label className="block mb-2">
        Pierna hábil:
        <select
          className="mt-1 w-full p-2 border rounded"
          value={foot}
          onChange={(e) => setFoot(e.target.value)}
        >
          <option>Derecha</option>
          <option>Izquierda</option>
          <option>Ambas</option>
        </select>
      </label>

      <label className="block mb-4">
        Velocidad máxima (km/h):
        <input
          type="number"
          className="mt-1 w-full p-2 border rounded"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
        />
      </label>

      <div className="text-sm text-gray-600">
        <strong>Vista previa:</strong> {name}, {position}, Pierna {foot}, Velocidad: {speed} km/h
      </div>
    </div>
  )
}
