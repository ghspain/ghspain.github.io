import React, { useMemo } from 'react';
import { Section, SectionIntro, Stack, AnimationProvider, Animate } from '@primer/react-brand'
import EventCard from './subcomponents/EventCard';
import eventStyles from './css/EventSection.module.css'
import { filterAndSortEvents } from '../utils/eventFilters'
import { useEvents } from '../hooks/useEvents'

const NextEventsSection: React.FC = () => {
  const { events, loading, error } = useEvents();
  const { upcomingEvents } = useMemo(() => filterAndSortEvents(events), [events]);

  if (loading) {
    return (
      <Section>
        <SectionIntro align="center">
          <SectionIntro.Heading size="2">Próximos eventos</SectionIntro.Heading>
        </SectionIntro>
        <Stack padding="spacious" alignItems="center" gap="spacious">
          Cargando eventos...
        </Stack>
      </Section>
    );
  }

  if (error) {
    return (
      <Section>
        <SectionIntro align="center">
          <SectionIntro.Heading size="2">Próximos eventos</SectionIntro.Heading>
        </SectionIntro>
        <Stack padding="spacious" alignItems="center" gap="spacious">
          Error cargando eventos: {error}
        </Stack>
      </Section>
    );
  }

  if (upcomingEvents.length === 0) {
    return (
      <Section>
        <SectionIntro align="center">
          <SectionIntro.Heading size="2">Próximos eventos</SectionIntro.Heading>
        </SectionIntro>
        <Stack padding="spacious" alignItems="center" gap="spacious">
          No hay eventos próximos ahora mismo. ¡Vuelve pronto!
        </Stack>
      </Section>
    );
  }

  return (
    <AnimationProvider>
      <Section paddingBlockEnd="none">
        <SectionIntro align="center">
          <SectionIntro.Heading size="2">Próximos eventos</SectionIntro.Heading>
        </SectionIntro>
        <div className={eventStyles.upcomingContainer}>
          <Stack direction="vertical" padding="spacious" alignItems="center" justifyContent="center" gap="normal">
            {upcomingEvents.map((event) => (
              <Animate key={event.event_id} animate="scale-in-up">
                <EventCard event={event} />
              </Animate>
            ))}
          </Stack>
        </div>
      </Section>
    </AnimationProvider>
  );
};

export default NextEventsSection;
