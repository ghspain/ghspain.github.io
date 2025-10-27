import { Section, Stack, AnimationProvider, SectionIntro } from '@primer/react-brand'
import { useOrganizers } from '../hooks'
import { OrganizerList } from './subcomponents/OrganizerList'

const RiverSection: React.FC = () => {
  const { data, loading, error } = useOrganizers()

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
          {loading && <div role="status" aria-live="polite">Cargando…</div>}
          {error && <div role="alert">Error: {error}</div>}
          {!loading && !error && <OrganizerList organizers={data} />}
        </AnimationProvider>
      </Stack>
    </Section>
  )
}

export default RiverSection
