import '@primer/react-brand/lib/css/main.css'
import '@primer/react-brand/fonts/fonts.css'
import { ThemeProvider } from '@primer/react-brand';
import { MinimalFooter, Navigation, PastEventsSection, HeroSection, CTASection, CardsSection, RiverSection, NextEventsSection } from './components';

const designTokenOverrides = `
  /* Map Primer brand tokens to Design System tokens */
  .custom-colors[data-color-mode='dark'] {
    --brand-color-canvas-default: var(--ds-bg-default);
    --brand-color-canvas-subtle: var(--ds-bg-subtle);
    --brand-color-text-default: var(--ds-text-default);
    --brand-color-text-muted: var(--ds-text-muted);
    --brand-CTABanner-shadow-color-start: var(--ds-accent-purple);
    --brand-CTABanner-shadow-color-end: #d946ef;
  }

  .custom-colors[data-color-mode='light'] {
    --brand-color-canvas-default: var(--ds-bg-default);
    --brand-color-canvas-subtle: var(--ds-bg-subtle);
    --brand-color-text-default: var(--ds-text-default);
    --brand-color-text-muted: var(--ds-text-muted);
    --brand-CTABanner-shadow-color-start: var(--ds-accent-purple);
    --brand-CTABanner-shadow-color-end: #d946ef;
  }
`

function App() {
  return (
    <ThemeProvider colorMode='auto' className="custom-colors">
      <style>{designTokenOverrides}</style>
      <div style={{ 
        position: 'relative', 
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'var(--ds-bg-default)',
        color: 'var(--ds-text-default)'
      }}>
        <Navigation />
        <HeroSection />
        {/* Upcoming events highlight */}
        <NextEventsSection />
        <CardsSection />
        <CTASection />
        {/* Past events list (rendered with Timeline subcomponent) */}
        <PastEventsSection />
        <RiverSection />
        <MinimalFooter socialLinks={["github", "linkedin", "youtube", "x", "meetup"]} />
      </div>
    </ThemeProvider >
  )
}

export default App;
