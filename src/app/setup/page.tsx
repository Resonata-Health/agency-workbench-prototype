import { Suspense } from 'react'
import SetupView from '@/views/SetupView'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SetupView />
    </Suspense>
  )
}
