import React, { useState, useEffect } from 'react';
import { Timeline, Section, Link, Stack, SectionIntro, AnimationProvider, Animate } from '@primer/react-brand'
import { Card } from './subcomponents/Card';
import cardStyles from './css/Card.module.css'
import eventStyles from './css/EventSection.module.css'
import { EVENT_CONFIG } from '../utils/events.constants'
import { EventData, filterAndSortEvents, calculateResponsiveWidth } from '../utils/eventFilters'

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
                    const imageUrls = eventsData.map(e => e.event_image || EVENT_CONFIG.DEFAULT_LOGO);
                    const loadImage = (src: string) => new Promise<number>((resolve) => {
                        const i = new Image();
                        i.src = src;
                        i.onload = () => resolve(i.naturalWidth || 0);
                        i.onerror = () => resolve(0);
                    });
                    Promise.all(imageUrls.map(loadImage)).then(widths => {
                        const max = widths.reduce((a, b) => Math.max(a, b), 0) || 640;
                        const clamped = Math.max(EVENT_CONFIG.MIN_CARD_WIDTH, Math.min(EVENT_CONFIG.MAX_CARD_WIDTH, max));
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
            const vw = typeof window !== 'undefined' ? window.innerWidth : 9999;
            const newWidth = calculateResponsiveWidth(
                cardWidth,
                vw,
                EVENT_CONFIG.RESPONSIVE_BREAKPOINT
            );
            setCardDisplayWidth(newWidth);
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
                    const { upcomingEvents, pastEvents } = filterAndSortEvents(events);

                    return (
                        <>
                            {upcomingEvents.length > 0 && (
                                <>
                                    <h3 className={eventStyles.sectionTitle}>
                                        {EVENT_CONFIG.UPCOMING_TITLE}
                                    </h3>
                                    <div 
                                        className={eventStyles.upcomingContainer}
                                        style={{ width: cardDisplayWidth || '100%' }}
                                    >
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
                                                        ctaText={EVENT_CONFIG.CTA_TEXT}
                                                        align="center"
                                                        className={cardStyles['Card--event']}
                                                        style={{ width: cardDisplayWidth || '100%', margin: '0 auto' }}
                                                    >
                                                        <Card.Image src={event.event_image || EVENT_CONFIG.DEFAULT_LOGO} alt={event.event_name} />
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
                                    <div className={eventStyles.pastEventsContainer}>
                                        <h3 className={eventStyles.sectionTitle}>
                                            {EVENT_CONFIG.PAST_TITLE}
                                        </h3>
                                        <div className={eventStyles.timelineWrapper}>
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
