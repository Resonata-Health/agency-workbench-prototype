'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LandingPage from '@/views/LandingPage'
import { usePermissions } from '@/app/providers'
import { PERSONA_HOME } from '@/data/permissions'

export default function Page() {
  const router = useRouter()
  const { persona } = usePermissions()

  // Sponsor / MLR personas have their own homes — bounce them there.
  // Agency keeps the existing root landing.
  useEffect(() => {
    if (persona !== 'agency') {
      router.replace(PERSONA_HOME[persona])
    }
  }, [persona, router])

  return <LandingPage />
}
