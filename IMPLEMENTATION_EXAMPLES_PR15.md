# Ejemplos de Implementación - PR 15 Refactorización

## 🎯 IMPLEMENTACIÓN FASE 1: Utilidades Base

### 1️⃣ Crear `src/utils/events.constants.ts`

```typescript
/**
 * Constantes centralizadas para la sección de eventos
 * Evita valores mágicos dispersos en el código
 */

export const EVENT_CONFIG = {
  // Imagen por defecto cuando no hay imagen del evento
  DEFAULT_LOGO: `${process.env.PUBLIC_URL}/images/logos/svg/Meetup.svg`,
  
  // Restricciones de ancho de tarjeta
  MIN_CARD_WIDTH: 320,      // Ancho mínimo en px
  MAX_CARD_WIDTH: 900,      // Ancho máximo en px
  
  // Punto de corte para diseño responsivo
  RESPONSIVE_BREAKPOINT: 640,  // En px, debajo usa %
  
  // Dimensiones de imagen dentro de la tarjeta
  CARD_IMAGE_HEIGHT: 260,   // Altura de la imagen en px
  CARD_MIN_HEIGHT: 320,     // Altura mínima de la tarjeta
  
  // Textos
  CTA_TEXT: 'Ver evento',
  UPCOMING_TITLE: 'Próximos eventos',
  PAST_TITLE: 'Eventos pasados',
  
  // Animaciones
  ANIMATION_DURATION: 220,  // ms
} as const;

export type EventConfig = typeof EVENT_CONFIG;
```

**Beneficios:**
- ✅ Un lugar único para constantes
- ✅ Fácil encontrar y modificar valores
- ✅ Reducir repetición en TimelineSection
- ✅ Consistencia en toda la app

---

### 2️⃣ Crear `src/utils/eventFilters.ts`

```typescript
import { EventData } from '../types/event';

/**
 * Interfaz para tipos de eventos
 */
export interface EventsGrouped {
  upcomingEvents: EventData[];
  pastEvents: EventData[];
}

/**
 * Filtra y ordena eventos en dos grupos: próximos y pasados
 * @param events - Array de eventos a filtrar
 * @returns Objeto con eventos próximos y pasados
 */
export const filterAndSortEvents = (events: EventData[]): EventsGrouped => {
  const now = new Date();
  
  const upcomingEvents = events
    .filter(event => new Date(event.event_date) > now)
    .sort((a, b) => 
      new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
    );
  
  const pastEvents = events
    .filter(event => new Date(event.event_date) <= now)
    .sort((a, b) => 
      new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
    );
  
  return { upcomingEvents, pastEvents };
};

/**
 * Calcula el ancho responsivo de la tarjeta
 * @param cardWidth - Ancho natural de la tarjeta en px (null = no medido)
 * @param viewportWidth - Ancho del viewport
 * @param breakpoint - Punto de corte para responsividad
 * @returns String con valor CSS (px o %)
 */
export const calculateResponsiveWidth = (
  cardWidth: number | null,
  viewportWidth: number,
  breakpoint: number = 640
): string => {
  if (!cardWidth) return '100%';
  
  // En pantallas pequeñas usa porcentaje
  if (viewportWidth < breakpoint) {
    return '90%';
  }
  
  // En pantallas grandes usa px medido
  return `${cardWidth}px`;
};
```

**Beneficios:**
- ✅ Funciones puras, fáciles de testear
- ✅ Lógica centralizada
- ✅ Reutilizable en otros componentes
- ✅ Documentación clara (JSDoc)

---

### 3️⃣ Crear `src/components/css/EventSection.module.css`

```css
/* EventSection.module.css */
/* Estilos consolidados para la sección de eventos */

.sectionTitle {
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 600;
  color: var(--brand-color-text-default);
  font-size: 1.25rem;
  letter-spacing: -0.01em;
}

.upcomingContainer {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  box-sizing: border-box;
}

.pastEventsContainer {
  width: 100%;
  max-width: 900px;
  margin: 2rem auto 0 auto;
  box-sizing: border-box;
}

.timelineWrapper {
  width: 100%;
  margin: 0 auto;
  padding-left: 0;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
}

/* Adaptación responsiva */
@media (max-width: 768px) {
  .sectionTitle {
    font-size: 1.1rem;
    margin-bottom: 0.75rem;
  }
  
  .upcomingContainer,
  .pastEventsContainer {
    padding: 0 1rem;
  }
}
```

**Beneficios:**
- ✅ Estilos centralizados en un archivo
- ✅ Soporta dark mode y temas
- ✅ Responsive design nativo
- ✅ Fácil mantener consistencia

---

### 4️⃣ Actualizar `TimelineSection.tsx` - FASE 1

```typescript
import React, { useState, useEffect } from 'react';
import { Timeline, Section, Link, Stack, SectionIntro, AnimationProvider, Animate } from '@primer/react-brand';
import { Card } from './subcomponents/Card';
import cardStyles from './css/Card.module.css';
import eventStyles from './css/EventSection.module.css'; // ✨ NUEVO
import { EVENT_CONFIG } from '../utils/events.constants';  // ✨ NUEVO
import { filterAndSortEvents, calculateResponsiveWidth } from '../utils/eventFilters'; // ✨ NUEVO

interface EventData {
  event_id: string;
  event_name: string;
  event_link: string;
  event_date: string;
  event_image?: string;
}

const TimelineSection: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cardWidth, setCardWidth] = useState<number | null>(null);
  const [cardDisplayWidth, setCardDisplayWidth] = useState<string | null>(null);

  // Cargar eventos
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const jsonUrl = `${process.env.PUBLIC_URL}/data/issues.json`;
        console.log('Loading events from:', jsonUrl);

        const response = await fetch(jsonUrl);
        if (!response.ok) {
          throw new Error(`Error loading events: ${response.status}`);
        }

        const eventsData: EventData[] = await response.json();
        console.log('Loaded events:', eventsData.length);

        setEvents(eventsData);

        // Medir imágenes para establecer ancho óptimo
        try {
          const imageUrls = eventsData.map(e => e.event_image || EVENT_CONFIG.DEFAULT_LOGO);
          const loadImage = (src: string) => new Promise<number>((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img.naturalWidth || 0);
            img.onerror = () => resolve(0);
          });
          
          Promise.all(imageUrls.map(loadImage))
            .then(widths => {
              const max = widths.reduce((a, b) => Math.max(a, b), 0) || 640;
              const clamped = Math.max(
                EVENT_CONFIG.MIN_CARD_WIDTH,
                Math.min(EVENT_CONFIG.MAX_CARD_WIDTH, max)
              );
              setCardWidth(clamped);
            })
            .catch(err => console.warn('Image measurement failed:', err));
        } catch (e) {
          console.warn('Image measurement skipped:', e);
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

  // Sincronizar ancho responsivo
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

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Section>
        <SectionIntro align="center">
          <SectionIntro.Heading size="1">Eventos</SectionIntro.Heading>
        </SectionIntro>
        <Stack padding="spacious" alignItems="center" gap="spacious">
          <Timeline fullWidth={false}>
            <Timeline.Item>Cargando eventos...</Timeline.Item>
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
            <Timeline.Item>Error cargando eventos: {error}</Timeline.Item>
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
            <Timeline.Item>No hay eventos disponibles</Timeline.Item>
          </Timeline>
        </Stack>
      </Section>
    );
  }

  const { upcomingEvents, pastEvents } = filterAndSortEvents(events); // ✨ NUEVO

  return (
    <AnimationProvider>
      <Section paddingBlockEnd="none">
        <SectionIntro align="center">
          <SectionIntro.Heading size="2">Eventos</SectionIntro.Heading>
        </SectionIntro>
        <Stack padding="spacious" alignItems="center" gap="spacious">
          {/* PRÓXIMOS EVENTOS */}
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
                        <Card.Image 
                          src={event.event_image || EVENT_CONFIG.DEFAULT_LOGO} 
                          alt={event.event_name} 
                        />
                        <Card.Heading>{event.event_name}</Card.Heading>
                        <Card.Description>{formatDate(event.event_date)}</Card.Description>
                      </Card>
                    </Animate>
                  ))}
                </Stack>
              </div>
            </>
          )}

          {/* EVENTOS PASADOS */}
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
                        <Animate animate="fade-in">
                          {formatDate(event.event_date)}{' '}
                        </Animate>
                        <Animate animate="slide-in-right">
                          <Link
                            arrowDirection="none"
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
        </Stack>
      </Section>
    </AnimationProvider>
  );
};

export default TimelineSection;
```

**Cambios principales:**
- ✅ Usa `EVENT_CONFIG` para constantes
- ✅ Usa `filterAndSortEvents()` para lógica
- ✅ Usa `calculateResponsiveWidth()` para ancho
- ✅ Usa clases CSS en lugar de inline styles
- ✅ Código más limpio y legible (252L → ~180L)

---

## 📊 COMPARACIÓN ANTES/DESPUÉS

### ANTES (Actual)
```typescript
const now = new Date();
const upcomingEvents = events
    .filter(event => new Date(event.event_date) > now)
    .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());

<h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Próximos eventos</h3>
<div style={{ width: cardDisplayWidth || '100%', maxWidth: 900, margin: '0 auto' }}>
```

### DESPUÉS (Refactorizado)
```typescript
const { upcomingEvents } = filterAndSortEvents(events);

<h3 className={eventStyles.sectionTitle}>
  {EVENT_CONFIG.UPCOMING_TITLE}
</h3>
<div 
  className={eventStyles.upcomingContainer}
  style={{ width: cardDisplayWidth || '100%' }}
>
```

**Ganancia:**
- ✅ Más legible
- ✅ Menos duplicación
- ✅ Fácil cambiar textos/estilos
- ✅ Reutilizable en otros lugares

---

## 🧪 TESTING

Una vez refactorizado, es fácil testear:

```typescript
// eventFilters.test.ts
import { filterAndSortEvents, calculateResponsiveWidth } from './eventFilters';

describe('eventFilters', () => {
  it('should filter upcoming and past events', () => {
    const now = new Date();
    const events = [
      { event_date: new Date(now.getTime() + 86400000).toISOString() }, // mañana
      { event_date: new Date(now.getTime() - 86400000).toISOString() }, // ayer
    ];
    
    const { upcomingEvents, pastEvents } = filterAndSortEvents(events as any);
    expect(upcomingEvents).toHaveLength(1);
    expect(pastEvents).toHaveLength(1);
  });

  it('should calculate responsive width correctly', () => {
    expect(calculateResponsiveWidth(800, 500, 640)).toBe('90%');
    expect(calculateResponsiveWidth(800, 1200, 640)).toBe('800px');
    expect(calculateResponsiveWidth(null, 1200, 640)).toBe('100%');
  });
});
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

- [ ] Crear `src/utils/events.constants.ts`
- [ ] Crear `src/utils/eventFilters.ts`
- [ ] Crear `src/components/css/EventSection.module.css`
- [ ] Actualizar `src/components/TimelineSection.tsx`
- [ ] Verificar que el sitio sigue funcionando igual
- [ ] Run linters: `npm run lint`
- [ ] Run tests: `npm test`
- [ ] Crear PR con cambios
- [ ] Code review

