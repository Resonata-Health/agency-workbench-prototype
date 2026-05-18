import { Suspense } from 'react'
import OutreachView from '@/views/OutreachView'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <OutreachView />
    </Suspense>
  )
}
