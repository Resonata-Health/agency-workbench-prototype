import { Suspense } from 'react'
import MatchesView from '@/views/MatchesView'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <MatchesView />
    </Suspense>
  )
}
