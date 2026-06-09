'use client'

import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { TopNav } from '@/components/TopNav'
import { WorkbenchTabs } from '@/components/WorkbenchTabs'
import { CONTAINER } from '@/components/container'
import { SetupStepper, type SetupStep } from '@/components/setup/SetupStepper'
import { findOffer, type SponsorName } from '@/data/mockCareOffers'
import { OverviewStep } from './OverviewStep'
import { CriteriaStep } from './CriteriaStep'
import { ContactsStep } from './ContactsStep'

const STEP_VALUES: SetupStep[] = ['overview', 'criteria', 'contacts']

export default function SetupWizard() {
  const params = useSearchParams()
  const offer = useMemo(() => findOffer(params.get('offer')), [params])
  const stepParam = params.get('step')
  const step: SetupStep =
    STEP_VALUES.find(s => s === stepParam) ?? 'overview'

  const [sponsor, setSponsor] = useState<SponsorName>(offer.sponsor as SponsorName)

  return (
    <div className="min-h-screen bg-charcoal-1 flex flex-col">
      <TopNav activeSponsor={sponsor} onSponsorChange={setSponsor} />

      {/* Offer subheader (consistent across all wizard steps after step 1 in spec; */}
      {/* keeping it on every step here for consistency with the rest of the app)   */}
      {step !== 'overview' && (
        <div className="bg-charcoal-white border-b border-charcoal-4">
          <div className={`${CONTAINER} h-[45px] flex items-center justify-between`}>
            <div className="flex items-center gap-4">
              <span className="text-[13px] font-semibold text-blue-12">{offer.internalId}</span>
              <span className="text-[13px] text-charcoal-12">{offer.title}</span>
            </div>
            <span className="text-[12px] text-charcoal-11">{offer.updatedLabel}</span>
          </div>
        </div>
      )}

      <WorkbenchTabs active="Setup" />

      <main className={`flex-1 ${CONTAINER} py-6`}>
        <SetupStepper current={step} />
        {step === 'overview' && <OverviewStep offer={offer} />}
        {step === 'criteria' && <CriteriaStep offer={offer} />}
        {step === 'contacts' && <ContactsStep offer={offer} />}
      </main>
    </div>
  )
}
