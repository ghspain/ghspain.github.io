import React, { useState, useEffect } from 'react';
import { Section, Stack, AnimationProvider, SectionIntro } from '@primer/react-brand';
import type { Organizer } from '../types/organizer'
import { OrganizerList } from './subcomponents/OrganizerList'


const RiverSection: React.FC = () => {
  const [organizers, setOrganizers] = useState<Organizer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res = await fetch(`${process.env.PUBLIC_URL}/data/organizers.json`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: Organizer[] = await res.json()
        if (mounted) setOrganizers(data)
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : String(err))
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

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
          {loading ? (
            <div>Cargando…</div>
          ) : error ? (
            <div>Error: {error}</div>
          ) : (
            <OrganizerList organizers={organizers} />
          )}
        </AnimationProvider>
      </Stack>
    </Section>
  );
};

export default RiverSection;

