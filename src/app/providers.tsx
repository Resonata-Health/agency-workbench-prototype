'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react'
import {
  DEFAULT_MATRIX,
  PERSONA_TO_ROLE,
  canCap,
  clearMatrix,
  loadMatrix,
  loadPersona,
  saveMatrix,
  savePersona,
  type Matrix,
  type Persona
} from '@/data/permissions'

interface PermsCtx {
  persona: Persona
  setPersona: (p: Persona) => void
  matrix: Matrix
  setMatrixCell: (roleId: string, capId: string, value: boolean) => void
  resetMatrix: () => void
  can: (capabilityId: string) => boolean
  roleId: string
}

const PermissionsContext = createContext<PermsCtx | null>(null)

function PermissionsProvider({ children }: { children: ReactNode }) {
  const [persona, setPersonaState] = useState<Persona>('agency')
  const [matrix, setMatrix] = useState<Matrix>(DEFAULT_MATRIX)

  // Hydrate from localStorage after mount (avoid SSR mismatch).
  useEffect(() => {
    setPersonaState(loadPersona())
    setMatrix(loadMatrix())
  }, [])

  const setPersona = useCallback((p: Persona) => {
    setPersonaState(p)
    savePersona(p)
  }, [])

  const setMatrixCell = useCallback((roleId: string, capId: string, value: boolean) => {
    setMatrix(prev => {
      const next: Matrix = {
        ...prev,
        [roleId]: { ...(prev[roleId] ?? {}), [capId]: value }
      }
      saveMatrix(next)
      return next
    })
  }, [])

  const resetMatrix = useCallback(() => {
    clearMatrix()
    setMatrix(DEFAULT_MATRIX)
  }, [])

  const roleId = PERSONA_TO_ROLE[persona]
  const can = useCallback(
    (capId: string) => canCap(matrix, roleId, capId),
    [matrix, roleId]
  )

  const value = useMemo<PermsCtx>(
    () => ({ persona, setPersona, matrix, setMatrixCell, resetMatrix, can, roleId }),
    [persona, setPersona, matrix, setMatrixCell, resetMatrix, can, roleId]
  )

  return (
    <PermissionsContext.Provider value={value}>{children}</PermissionsContext.Provider>
  )
}

export function usePermissions() {
  const ctx = useContext(PermissionsContext)
  if (!ctx) throw new Error('usePermissions must be used within PermissionsProvider')
  return ctx
}

export function useCan(capability: string) {
  return usePermissions().can(capability)
}

export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 60_000, refetchOnWindowFocus: false } }
      })
  )
  return (
    <QueryClientProvider client={client}>
      <PermissionsProvider>{children}</PermissionsProvider>
    </QueryClientProvider>
  )
}
