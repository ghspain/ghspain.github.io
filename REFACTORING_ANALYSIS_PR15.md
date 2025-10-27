# Análisis de PR 15 - Refactorización y Mejoras de Código

## 📋 Resumen de Cambios en PR 15

### Archivos Modificados (6 archivos)
1. **CardsSection.tsx** - Cambios menores en uso de componentes
2. **TimelineSection.tsx** - Cambios mayores en lógica de eventos
3. **Card.module.css** - Nuevos estilos para variante de eventos
4. **Card.tsx** - Mejoras en componente Card
5. **Constants.tsx** - Pequeño cambio en tipos
6. **MinimalFooter.tsx** - Limpieza de código

---

## 🔍 OPORTUNIDADES DE REFACTORIZACIÓN IDENTIFICADAS

### 1. **TimelineSection.tsx** - CRÍTICA: Lógica Acoplada

#### Problema Actual:
```typescript
// Líneas 175-245: Lógica compleja en un IIFE (Immediately Invoked Function Expression)
{(() => {
    const now = new Date();
    const upcomingEvents = events
        .filter(event => new Date(event.event_date) > now)
        .sort(...)
    const pastEvents = events
        .filter(event => new Date(event.event_date) <= now)
        .sort(...)
    // ... 60+ líneas de JSX
})()}
```

#### Problemas:
- ❌ Lógica de filtrado duplicada
- ❌ Función anónima de 70+ líneas
- ❌ Difícil de testear
- ❌ No reutilizable
- ❌ Estilos inline por todas partes

#### Refactorización Propuesta:

**1a. Extraer constantes a archivo dedicado: `src/utils/events.constants.ts`**
```typescript
export const EVENT_CONFIG = {
  DEFAULT_LOGO: `${process.env.PUBLIC_URL}/images/logos/svg/Meetup.svg`,
  MIN_CARD_WIDTH: 320,
  MAX_CARD_WIDTH: 900,
  RESPONSIVE_BREAKPOINT: 640,
  CARD_IMAGE_HEIGHT: 260,
  MIN_HEIGHT: 320,
  CTA_TEXT: 'Ver evento',
};
```

**1b. Extraer utilidades de eventos: `src/utils/eventFilters.ts`**
```typescript
export const filterAndSortEvents = (events: EventData[]) => {
  const now = new Date();
  return {
    upcomingEvents: events
      .filter(event => new Date(event.event_date) > now)
      .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime()),
    pastEvents: events
      .filter(event => new Date(event.event_date) <= now)
      .sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime()),
  };
};

export const calculateResponsiveWidth = (cardWidth: number | null, viewportWidth: number): string => {
  if (!cardWidth) return '100%';
  return viewportWidth < EVENT_CONFIG.RESPONSIVE_BREAKPOINT ? '90%' : `${cardWidth}px`;
};
```

**1c. Extraer hook para ancho de tarjeta: `src/hooks/useEventCardWidth.ts`**
```typescript
export const useEventCardWidth = (events: EventData[]) => {
  const [cardWidth, setCardWidth] = useState<number | null>(null);
  const [cardDisplayWidth, setCardDisplayWidth] = useState<string | null>(null);

  useEffect(() => {
    // Medir y establecer ancho...
  }, []);

  useEffect(() => {
    // Sincronizar con viewport...
  }, [cardWidth]);

  return { cardWidth, cardDisplayWidth };
};
```

**1d. Extraer componentes para upcoming/past events:**

`src/components/EventCards/UpcomingEventsSection.tsx`
`src/components/EventCards/PastEventsSection.tsx`

---

### 2. **Card.tsx** - MODERADA: Mejoras en Tipos y Limpieza

#### Problema Actual:
```typescript
// Línea 20: Importación no utilizada
import stylesLink from '../Link/Link.module.css'  // ❌ NO SE USA

// Línea 90: showCTA prop añadido pero podría tener valores por defecto más inteligentes
showCTA = true
```

#### Refactorización Propuesta:

**2a. Ya realizado:** Remover import no utilizado ✅
- `import stylesLink` fue removido correctamente

**2b. Crear tipos específicos: `src/types/card.ts`**
```typescript
export type CardVariant = 'default' | 'minimal' | 'torchlight';
export type CardAlign = 'start' | 'center';
export type CardSize = 'sm' | 'md' | 'lg';

export interface CardEventConfig {
  showCTA: boolean;
  variant: CardVariant;
  imagePlacement?: 'top' | 'bottom';
}

export const CARD_PRESETS = {
  event: { showCTA: true, variant: 'default' },
  copy: { showCTA: false, variant: 'default' },
  cta: { showCTA: true, variant: 'default' },
} as const;
```

**2c. Refactorización de CardCopy/CardEvent:**
```typescript
// ACTUAL (posterior a PR)
export const CardEvent = (props: CardProps) => <CardRoot {...props} showCTA={true} />
export const CardCopy = (props: CardProps) => <CardRoot {...props} showCTA={false} />

// MEJORADO: Usar factory function
export const createCardVariant = (config: CardEventConfig) => 
  (props: CardProps) => <CardRoot {...props} {...config} />

export const CardEvent = createCardVariant(CARD_PRESETS.event);
export const CardCopy = createCardVariant(CARD_PRESETS.copy);
```

---

### 3. **TimelineSection.tsx** - CRÍTICA: Estilos Inline

#### Problema:
```typescript
// Líneas 188, 189, 219, 220, 221: Estilos inline diseminados
<h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>
<div style={{ width: cardDisplayWidth || '100%', maxWidth: 900, margin: '0 auto' }}>
<div style={{ width: '100%', margin: '0 auto', paddingLeft: 0, display: 'flex', justifyContent: 'center' }}>
```

#### Refactorización:

**3a. Crear módulo CSS: `src/components/css/EventSection.module.css`**
```css
.sectionTitle {
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 600;
}

.upcomingContainer {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}

.pastEventsContainer {
  width: 100%;
  max-width: 900px;
  margin: 2rem auto 0 auto;
}

.timelineWrapper {
  width: 100%;
  margin: 0 auto;
  padding-left: 0;
  display: flex;
  justify-content: center;
}
```

**3b. Usar en componente:**
```typescript
import eventStyles from './css/EventSection.module.css';

<h3 className={eventStyles.sectionTitle}>Próximos eventos</h3>
<div className={eventStyles.upcomingContainer} style={{ width: cardDisplayWidth || '100%' }}>
```

---

### 4. **Medición de Imágenes - CRÍTICA: Mejoras Necesarias**

#### Problema Actual (líneas 45-63):
```typescript
// Medir imágenes dentro de loadEvents() - acoplamiento
Promise.all(imageUrls.map(loadImage))
  .then(widths => { /* ... */ })
  .catch(() => { /* ignore */ });  // ❌ Swallowing errors silently
```

#### Refactorización Propuesta:

**4a. Crear utilidad: `src/utils/imageLoader.ts`**
```typescript
export interface ImageMeasurement {
  url: string;
  width: number;
  error?: boolean;
}

export const loadImageDimensions = async (urls: string[]): Promise<ImageMeasurement[]> => {
  const results: ImageMeasurement[] = [];
  
  for (const url of urls) {
    try {
      const width = await new Promise<number>((resolve) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(img.naturalWidth || 0);
        img.onerror = () => resolve(0);
        // Timeout after 5 seconds
        setTimeout(() => resolve(0), 5000);
      });
      results.push({ url, width });
    } catch (err) {
      console.error(`Failed to load image: ${url}`, err);
      results.push({ url, width: 0, error: true });
    }
  }
  
  return results;
};

export const getOptimalCardWidth = (measurements: ImageMeasurement[], config: {min: number, max: number}): number => {
  const widths = measurements
    .filter(m => !m.error && m.width > 0)
    .map(m => m.width);
  
  if (widths.length === 0) return config.min;
  
  const max = Math.max(...widths);
  return Math.max(config.min, Math.min(config.max, max));
};
```

---

### 5. **CardsSection.tsx** - MENOR: Estructura de Componentes

#### Problema:
```typescript
// Repetición de estructura (3 tarjetas idénticas)
<CardCopy>
  <Card.Heading>Altruista...</Card.Heading>
  <Card.Description>...</Card.Description>
</CardCopy>
```

#### Refactorización:

**5a. Extraer datos a constante: `src/components/data/cardsData.ts`**
```typescript
export const COMMUNITY_CARDS = [
  {
    id: 'altruistic',
    title: 'Altruista y generosa',
    description: 'Nadie en la organización...',
    link: 'https://www.meetup.com/ghspain'
  },
  {
    id: 'open',
    title: 'Abierta y participativa',
    description: 'Cualquier persona que quiera...',
    link: 'https://www.meetup.com/ghspain'
  },
  {
    id: 'github',
    title: 'Basada en Github',
    description: 'GitHub nos permite...',
    link: 'https://www.meetup.com/ghspain'
  },
] as const;
```

**5b. Componente mejorado:**
```typescript
<Stack>
  {COMMUNITY_CARDS.map((card) => (
    <Animate key={card.id} animate="scale-in-up">
      <CardCopy href={card.link} hasBorder fullWidth align="center">
        <Card.Heading>{card.title}</Card.Heading>
        <Card.Description>{card.description}</Card.Description>
      </CardCopy>
    </Animate>
  ))}
</Stack>
```

---

### 6. **MinimalFooter.tsx** - MENOR: Limpieza Completada ✅

#### Ya realizado:
- ✅ Simplificación de lógica de filtrado
- ✅ Remover código innecesario
- ✅ Comentar tipos no utilizados

---

## 📊 TABLA DE PRIORIDADES

| Refactorización | Prioridad | Impacto | Complejidad | Archivos |
|---|---|---|---|---|
| Extraer constantes de eventos | 🔴 CRÍTICA | Alto | Baja | 1 nuevo + TimelineSection |
| Extraer filtros/utilidades de eventos | 🔴 CRÍTICA | Alto | Media | 1 nuevo + TimelineSection |
| Extraer hook useEventCardWidth | 🟡 ALTA | Medio | Media | 1 nuevo + TimelineSection |
| Mover estilos inline a CSS | 🟡 ALTA | Medio | Baja | 1 nuevo + TimelineSection |
| Crear tipos centralizados (Card) | 🟡 ALTA | Medio | Baja | 1 nuevo + Card.tsx |
| Extraer componentes EventCards | 🟡 ALTA | Medio | Alta | 2 nuevos + TimelineSection |
| Extraer datos de CardsSection | 🟠 MEDIA | Bajo | Muy Baja | 1 nuevo + CardsSection |
| Mejorar manejo de imágenes | 🟠 MEDIA | Bajo | Media | 1 nuevo + TimelineSection |

---

## 🎯 PLAN DE IMPLEMENTACIÓN RECOMENDADO

### Fase 1: Utilidades Base (Sin riesgo)
1. Crear `src/utils/events.constants.ts` ✅
2. Crear `src/utils/eventFilters.ts` ✅
3. Actualizar TimelineSection para usar estas ✅

### Fase 2: Hooks y Lógica
1. Crear `src/hooks/useEventCardWidth.ts` ✅
2. Simplificar TimelineSection ✅

### Fase 3: Estilos y Componentes
1. Crear `src/components/css/EventSection.module.css` ✅
2. Refactorizar TimelineSection JSX ✅
3. Opcionalmente: Extraer UpcomingEventsSection.tsx y PastEventsSection.tsx

### Fase 4: Tipos y Presets (Futuros)
1. Crear `src/types/card.ts`
2. Mejorar Card.tsx con factory functions

---

## ✨ BENEFICIOS ESPERADOS

✅ **Mantenibilidad**: Código modular y reutilizable
✅ **Testabilidad**: Funciones puras fáciles de testear
✅ **Performance**: Mejor manejo de imágenes y resize listeners
✅ **Escalabilidad**: Fácil agregar nuevas variantes de eventos
✅ **Readabilidad**: Menos líneas por archivo, mejor separación de concerns
✅ **SSR-Ready**: Mejor manejo de window (typeof window checks)

