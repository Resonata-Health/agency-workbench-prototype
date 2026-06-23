'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MlrLandingView from '@/views/MlrLandingView'
import { usePermissions } from '@/app/providers'
import { PERSONA_HOME } from '@/data/permissions'

export default function Page() {
  const router = useRouter()
  const { persona } = usePermissions()
  useEffect(() => {
    if (persona !== 'mlr') router.replace(PERSONA_HOME[persona])
  }, [persona, router])
  return <MlrLandingView />
}
