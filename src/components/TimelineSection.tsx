import React, { useMemo } from 'react';
import { Timeline, Section, Link, Stack, SectionIntro, AnimationProvider, Animate } from '@primer/react-brand'
import { useEvents } from '../hooks'
import type { EventData } from '../types/event'
import { formatDateEs } from '../utils/date'

const TimelineSection: React.FC = () => {
    const { data, loading, error } = useEvents();

    // Los 5 eventos más recientes, incluyendo los próximos.
    // Se ordenan por proximidad a la fecha actual: los futuros más cercanos
    // primero y, si no hay suficientes, se completan con los pasados más recientes.
    const events = useMemo(() => {
        const now = Date.now();
        return [...data]
            .sort((a: EventData, b: EventData) => {
                const dateA = new Date(a.start).getTime();
                const dateB = new Date(b.start).getTime();
                // Distancia absoluta a "ahora": más cercanos primero
                return Math.abs(dateA - now) - Math.abs(dateB - now);
            })
            .slice(0, 5)
            .sort((a: EventData, b: EventData) => {
                // Dentro de los 5 seleccionados, ordenar cronológicamente
                return new Date(a.start).getTime() - new Date(b.start).getTime();
            });
    }, [data]);

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
                    {events.map((event) => {
                        const isFuture = new Date(event.start) > new Date();
                        return (
                            <Timeline.Item key={event.uid}>
                                <Animate animate="fade-in">
                                    {formatDateEs(event.start)}{' '}
                                </Animate>
                                <Animate animate="slide-in-right">
                                    <Link
                                        arrowDirection='none'
                                        href={event.url ?? '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {isFuture ? 'Próximamente: ' : ''}{event.title}
                                    </Link>
                                </Animate>
                            </Timeline.Item>
                        );
                    })}
                </Timeline>
            </Stack>
        </Section>
        </AnimationProvider>
    );
};

export default TimelineSection;
