import React, { useState, useEffect } from 'react';
import { Timeline, Section, Stack, SectionIntro, AnimationProvider } from '@primer/react-brand'
import eventStyles from './css/EventSection.module.css'
import { EVENT_CONFIG } from '../utils/events.constants'
import { EventData, filterAndSortEvents } from '../utils/eventFilters'
import ListMessage from './subcomponents/ListMessage'
import PastEventsItem from './subcomponents/PastEventsItem'

const PastEventsSection: React.FC = () => {
    const [events, setEvents] = useState<EventData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadEvents = async () => {
            try {
                // Usar la misma URL tanto en desarrollo como en producción
                const jsonUrl = `${process.env.PUBLIC_URL}/data/issues.json`;

                console.log('Loading events from:', jsonUrl); // Debug log

                const response = await fetch(jsonUrl);

                if (!response.ok) {
                    throw new Error(`Error loading events: ${response.status}`);
                }

                const eventsData: EventData[] = await response.json();

                console.log('Loaded events:', eventsData.length); // Debug log

                // Don't sort here; we'll sort after filtering
                setEvents(eventsData);
                // Upcoming events are handled in EventsSection; image sizing measurement removed.
            } catch (err) {
                console.error('Error loading events:', err);
                setError(err instanceof Error ? err.message : 'Error desconocido');
            } finally {
                setLoading(false);
            }
        };

        loadEvents();
    }, []);


    if (loading) {
        return (
            <Section>
                <SectionIntro align="center">
                    <SectionIntro.Heading size="1">Eventos</SectionIntro.Heading>
                </SectionIntro>
                <ListMessage message="Cargando eventos..." fullWidth={false} />
            </Section>
        );
    }

    if (error) {
        return (
            <Section>
                <SectionIntro align="center">
                    <SectionIntro.Heading size="1">Eventos</SectionIntro.Heading>
                </SectionIntro>
                <ListMessage message={`Error cargando eventos: ${error}`} fullWidth={true} />
            </Section>
        );
    }

    if (events.length === 0) {
        return (
            <Section>
                <SectionIntro align="center">
                    <SectionIntro.Heading size="1">Eventos</SectionIntro.Heading>
                </SectionIntro>
                <ListMessage message="No hay eventos disponibles" fullWidth={true} />
            </Section>
        );
    }

    return (
        <AnimationProvider>
        <Section paddingBlockEnd="none">
            <SectionIntro align="center">
                <SectionIntro.Heading size="2">Eventos pasados</SectionIntro.Heading>
            </SectionIntro>
            <Stack padding="spacious" alignItems="center" gap="spacious">
                {(() => {
                    const { pastEvents } = filterAndSortEvents(events);

                    if (pastEvents.length === 0) return null;

                    return (
                        <div className={eventStyles.pastEventsContainer}>
                            <h3 className={eventStyles.sectionTitle}>
                                {EVENT_CONFIG.PAST_TITLE}
                            </h3>
                            <div className={eventStyles.timelineWrapper}>
                                <Timeline fullWidth={false}>
                                    {pastEvents.map((event) => (
                                        <PastEventsItem key={event.event_id} event={event} openInNewTab />
                                    ))}
                                </Timeline>
                            </div>
                        </div>
                    );
                })()}
            </Stack>
        </Section>
        </AnimationProvider>
    );
};

export default PastEventsSection;
