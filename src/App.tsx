import '@primer/react-brand/lib/css/main.css'
import '@primer/react-brand/fonts/fonts.css'
import { ThemeProvider } from '@primer/react-brand';
import { MinimalFooter, Navigation, TimelineSection, HeroSection, CTASection, CardsSection, RiverSection } from './components';
import RafflePage from './pages/RafflePage';

const designTokenOverrides = `
  .custom-colors[data-color-mode='dark'] {
    /*
     * Modify the value of these tokens.
     * Remember to apply light mode equivalents if you're enabling theme switching.
     */
    --brand-CTABanner-shadow-color-start: var(--base-color-scale-purple-5);
    --brand-CTABanner-shadow-color-end: var(--base-color-scale-pink-5);
  }

  .custom-colors[data-color-mode='light'] {
    /*
     * Modify the value of these tokens.
     * Remember to apply light mode equivalents if you're enabling theme switching.
     */
    --brand-CTABanner-shadow-color-start: var(--base-color-scale-purple-5);
    --brand-CTABanner-shadow-color-end: var(--base-color-scale-pink-5);
  }
`

function App() {
  return (
    <ThemeProvider colorMode='auto' className="custom-colors">
      <style>{designTokenOverrides}</style>
      <div
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '100vh',
          backgroundColor: 'var(--brand-color-canvas-default)',
          color: 'var(--brand-color-text-default)'
        }}
      >
        {/* Render a standalone raffle page when path is /raffle */}
        {typeof window !== 'undefined' && window.location && window.location.pathname === '/raffle' ? (
          <RafflePage />
        ) : (
          <>
            <Navigation />
            <HeroSection />
            <CardsSection />
            <CTASection />
            <TimelineSection />
            <RiverSection />
            <MinimalFooter socialLinks={["github", "linkedin", "youtube", "x", "meetup"]} />
          </>
        )}
      </div>
    </ThemeProvider >
  )
}

export default App;
