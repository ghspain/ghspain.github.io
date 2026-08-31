import { useEffect } from 'react';
import '@primer/react-brand/lib/css/main.css'
import '@primer/react-brand/fonts/fonts.css'
import { ThemeProvider } from '@primer/react-brand';
import { MinimalFooter, Navigation, TimelineSection, HeroSection, CTASection, CardsSection, RiverSection, FormSection } from './components';

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
  // Cuando se entra directamente con un hash en la URL (p. ej. #participa),
  // el navegador intenta hacer scroll antes de que React haya renderizado el DOM,
  // por lo que se queda arriba. Este efecto se ejecuta tras el render y hace
  // scroll al elemento correspondiente.
  useEffect(() => {
    // Los acortadores de X y LinkedIn eliminan el fragmento (#) de la URL, así
    // que githubcommunity.es/#participa se convierte en githubcommunity.es/participa.
    // Si la app se carga en una ruta que no es la raíz, la convertimos en un hash
    // y redirigimos a la raíz (p. ej. /participa -> /#participa).
    const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
    if (path) {
      window.location.replace('/#' + path);
      return;
    }

    const hash = window.location.hash;
    if (hash) {
      const id = hash.slice(1); // quita el '#'
      // Esperamos un frame para asegurar que el DOM está completamente pintado
      requestAnimationFrame(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  }, []);

  return (
    <ThemeProvider colorMode='auto' className="custom-colors">
      <style>{designTokenOverrides}</style>
      <div style={{ 
        position: 'relative', 
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'var(--brand-color-canvas-default)',
        color: 'var(--brand-color-text-default)'
      }}>
        <Navigation />
        <HeroSection />
        <FormSection />
        <CardsSection />
        <CTASection />
        <TimelineSection />
        <RiverSection />
        <MinimalFooter socialLinks={["github", "linkedin", "youtube", "x", /* "meetup", */ "luma"]} />
      </div>
    </ThemeProvider >
  )
}

export default App;
