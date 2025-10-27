import { useState, useEffect } from 'react'
import { Section, Stack, AnimationProvider, SectionIntro } from '@primer/react-brand'
import type { Organizer } from '../types/organizer'
import { OrganizerList } from './subcomponents/OrganizerList'

interface LoadState {
  data: Organizer[]
  loading: boolean
  error: string | null
}

const RiverSection: React.FC = () => {
  const [state, setState] = useState<LoadState>({
    data: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    let mounted = true

    const loadOrganizers = async () => {
      try {
        const url = `${process.env.PUBLIC_URL}/data/organizers.json`
        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to load organizers`)
        }
        
        const organizers: Organizer[] = await response.json()
        
        if (mounted) {
          setState({ data: organizers, loading: false, error: null })
        }
      } catch (err) {
        if (mounted) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error'
          setState({ data: [], loading: false, error: errorMessage })
        }
      }
    }

    loadOrganizers()

    return () => {
      mounted = false
    }
  }, [])

  const { data, loading, error } = state

  return (
    <Section paddingBlockStart="none" paddingBlockEnd="spacious" id="quienes-somos">
      <SectionIntro align="center">
        <SectionIntro.Heading size="3">¿Quiénes somos?</SectionIntro.Heading>
        <SectionIntro.Description>
          Un pequeño equipo voluntario que organiza los encuentros de la comunidad.
        </SectionIntro.Description>
      </SectionIntro>

      <Stack>
        <AnimationProvider>
          {loading && <div>Cargando…</div>}
          {error && <div>Error: {error}</div>}
          {!loading && !error && <OrganizerList organizers={data} />}
        </AnimationProvider>
      </Stack>
    </Section>
  )
}

export default RiverSection
