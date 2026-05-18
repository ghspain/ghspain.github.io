import React, { useMemo } from 'react';
import { Timeline, Section, Link, Stack, SectionIntro, AnimationProvider, Animate } from '@primer/react-brand'
import { useEvents } from '../hooks'
import type { EventData } from '../types/event'
import { formatDateEs } from '../utils/date'

const TimelineSection: React.FC = () => {
    const { data, loading, error } = useEvents();

    const events = useMemo(() => {
        return [...data].sort((a: EventData, b: EventData) => {
            const dateA = new Date(a.event_date);
            const dateB = new Date(b.event_date);
            return dateB.getTime() - dateA.getTime();
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
                    {events.slice(0, 5).map((event) => {
                        const isFuture = new Date(event.event_date) > new Date();
                        return (
                            <Timeline.Item key={event.event_id}>
                                <Animate animate="fade-in">
                                    {formatDateEs(event.event_date)}{' '}
                                </Animate>
                                <Animate animate="slide-in-right">
                                    <Link
                                        arrowDirection='none'
                                        href={event.event_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {isFuture ? 'Próximamente: ' : ''}{event.event_name}
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
