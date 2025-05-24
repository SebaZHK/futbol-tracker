// app/training/page.tsx
import TrainingForm from '@/components/TrainingForm'

export default function TrainingPage() {
  return (
    <div className="space-y-6 py-8">
      <h1 className="text-3xl font-bold text-code-cyan text-center">
        Entrenamiento
      </h1>
      <TrainingForm />
    </div>
  )
}
