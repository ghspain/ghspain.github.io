import React, { useState, useEffect } from 'react';
import { Timeline, Section, Link, Stack, SectionIntro, AnimationProvider, Animate } from '@primer/react-brand'

interface EventData {
    event_id: string;
    event_name: string;
    event_link: string;
    event_date: string;
}

const TimelineSection: React.FC = () => {
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

                // Ordenar eventos por fecha (más recientes primero)
                const sortedEvents = eventsData.sort((a, b) => {
                    const dateA = new Date(a.event_date);
                    const dateB = new Date(b.event_date);
                    return dateB.getTime() - dateA.getTime();
                });

                setEvents(sortedEvents);
            } catch (err) {
                console.error('Error loading events:', err);
                setError(err instanceof Error ? err.message : 'Error desconocido');
            } finally {
                setLoading(false);
            }
        };

        loadEvents();
    }, []);

    const formatDate = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch {
            return dateString; // Fallback al string original si no se puede parsear
        }
    };

    if (loading) {
        return (
            <Section>
                <SectionIntro align="center">
                    <SectionIntro.Heading size="1">Últimos eventos</SectionIntro.Heading>
                </SectionIntro>
                <Stack padding="spacious" alignItems="center" gap="spacious">
                    <Timeline fullWidth={false}>
                        <Timeline.Item>
                            Cargando eventos...
                        </Timeline.Item>
                    </Timeline>
                </Stack>
            </Section>
        );
    }

    if (error) {
        return (
            <Section>
                <SectionIntro align="center">
                    <SectionIntro.Heading size="1">Últimos eventos</SectionIntro.Heading>
                </SectionIntro>
                <Stack padding="spacious" alignItems="center" gap="spacious">
                    <Timeline fullWidth={true}>
                        <Timeline.Item>
                            Error cargando eventos: {error}
                        </Timeline.Item>
                    </Timeline>
                </Stack>
            </Section>
        );
    }

    if (events.length === 0) {
        return (
            <Section>
                <SectionIntro align="center">
                    <SectionIntro.Heading size="1">Últimos eventos</SectionIntro.Heading>
                </SectionIntro>
                <Stack padding="spacious" alignItems="center" gap="spacious">
                    <Timeline fullWidth={true}>
                        <Timeline.Item>
                            No hay eventos disponibles
                        </Timeline.Item>
                    </Timeline>
                </Stack>
            </Section>
        );
    }

    return (
        <AnimationProvider>
        <Section paddingBlockEnd="none">
            <SectionIntro align="center">
                <SectionIntro.Heading size="2">Últimos eventos</SectionIntro.Heading>
            </SectionIntro>
            <Stack padding="spacious" alignItems="center" gap="spacious">
                <Timeline fullWidth={true}>
                    {events.map((event) => (
                        <Timeline.Item key={event.event_id}>
                            <Animate animate="fade-in">
                            {formatDate(event.event_date)}{' '}
                            </Animate>
                            <Animate animate="slide-in-right">
                            <Link
                                arrowDirection='none'
                                href={event.event_link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {event.event_name}
                            </Link>
                            </Animate>
                        </Timeline.Item>
                    ))}
                </Timeline>
            </Stack>
        </Section>
        </AnimationProvider>
    );
};

export default TimelineSection;
