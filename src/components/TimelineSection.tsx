import React, { useState, useEffect } from 'react';
import { Timeline, Section, Link, Stack, SectionIntro, AnimationProvider, Animate } from '@primer/react-brand'
import { Card } from './subcomponents/Card';
import cardStyles from './css/Card.module.css'

interface EventData {
    event_id: string;
    event_name: string;
    event_link: string;
    event_date: string;
    event_image?: string;
}

// Module-level constants used throughout the component
const DEFAULT_LOGO = `${process.env.PUBLIC_URL}/images/logos/svg/Meetup.svg`;
const MIN_CARD_WIDTH = 320;
const MAX_CARD_WIDTH = 900;
const RESPONSIVE_BREAKPOINT = 640;

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

                // Don't sort here; we'll sort after filtering
                setEvents(eventsData);
                // Measure natural widths of all event images and pick the max as default
                try {
                    const imageUrls = eventsData.map(e => e.event_image || DEFAULT_LOGO);
                    const loadImage = (src: string) => new Promise<number>((resolve) => {
                        const i = new Image();
                        i.src = src;
                        i.onload = () => resolve(i.naturalWidth || 0);
                        i.onerror = () => resolve(0);
                    });
                    Promise.all(imageUrls.map(loadImage)).then(widths => {
                        const max = widths.reduce((a, b) => Math.max(a, b), 0) || 640;
                        const clamped = Math.max(MIN_CARD_WIDTH, Math.min(MAX_CARD_WIDTH, max));
                        setCardWidth(clamped);
                    }).catch(() => {
                        /* ignore */
                    });
                } catch (e) {
                    // ignore measurement failures
                }
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

    const [cardWidth, setCardWidth] = useState<number | null>(null);
    // cardDisplayWidth is the value applied to Card style: px on desktop, % on small screens
    const [cardDisplayWidth, setCardDisplayWidth] = useState<string | null>(null);

    // keep cardDisplayWidth in sync with cardWidth and viewport size
    useEffect(() => {
        const update = () => {
            if (!cardWidth) {
                setCardDisplayWidth('100%');
                return;
            }
            const vw = typeof window !== 'undefined' ? window.innerWidth : 9999;
            // breakpoint for switching to responsive percentage
            const breakpoint = RESPONSIVE_BREAKPOINT;
            if (vw < breakpoint) {
                // use percentage on small screens
                setCardDisplayWidth('90%');
            } else {
                setCardDisplayWidth(`${cardWidth}px`);
            }
        };

        update();
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', update);
            return () => window.removeEventListener('resize', update);
        }
    }, [cardWidth]);

    if (loading) {
        return (
            <Section>
                <SectionIntro align="center">
                    <SectionIntro.Heading size="1">Eventos</SectionIntro.Heading>
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
                    <SectionIntro.Heading size="1">Eventos</SectionIntro.Heading>
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
                    <SectionIntro.Heading size="1">Eventos</SectionIntro.Heading>
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
                <SectionIntro.Heading size="2">Eventos</SectionIntro.Heading>
            </SectionIntro>
            <Stack padding="spacious" alignItems="center" gap="spacious">
                {(() => {
                    const now = new Date();
                    const upcomingEvents = events
                        .filter(event => new Date(event.event_date) > now)
                        .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
                    const pastEvents = events
                        .filter(event => new Date(event.event_date) <= now)
                        .sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime());

                    return (
                        <>
                            {upcomingEvents.length > 0 && (
                                <>
                                    <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Próximos eventos</h3>
                                    <div style={{ width: cardDisplayWidth || '100%', maxWidth: 900, margin: '0 auto' }}>
                                        <Stack
                                            direction="vertical"
                                            padding="spacious"
                                            alignItems="center"
                                            justifyContent="center"
                                            gap="normal"
                                        >
                                            {upcomingEvents.map((event) => (
                                                <Animate key={event.event_id} animate="scale-in-up">
                                                    <Card
                                                        href={event.event_link}
                                                        hasBorder
                                                        ctaText="Ver evento"
                                                        align="center"
                                                        className={cardStyles['Card--event']}
                                                        style={{ width: cardDisplayWidth || '100%', margin: '0 auto' }}
                                                    >
                                                        <Card.Image src={event.event_image || DEFAULT_LOGO} alt={event.event_name} />
                                                        <Card.Heading>{event.event_name}</Card.Heading>
                                                        <Card.Description>{formatDate(event.event_date)}</Card.Description>
                                                    </Card>
                                                </Animate>
                                            ))}
                                        </Stack>
                                    </div>
                                </>
                            )}
                            {pastEvents.length > 0 && (
                                <>
                                    <div style={{ width: cardDisplayWidth || '100%', maxWidth: 900, margin: '2rem auto 0 auto' }}>
                                        <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Eventos pasados</h3>
                                        <div style={{ width: '100%', margin: '0 auto', paddingLeft: 0, display: 'flex', justifyContent: 'center' }}>
                                            <Timeline fullWidth={false}>
                                                {pastEvents.map((event) => (
                                                    <Timeline.Item key={event.event_id}>
                                                        <Animate animate="fade-in">{formatDate(event.event_date)} </Animate>
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
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    );
                })()}
            </Stack>
        </Section>
        </AnimationProvider>
    );
};

export default TimelineSection;
