import React from 'react';
import RaffleSection from '../components/RaffleSection';

const RafflePage: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--brand-color-canvas-default)', padding: 24 }}>
      <main style={{ maxWidth: 900, margin: '0 auto' }}>
        <h1>Sorteo de merchandising</h1>
        <p>Esta página está dedicada únicamente al sorteo. Por ahora funciona en modo manual.</p>
        <RaffleSection />
      </main>
    </div>
  );
};

export default RafflePage;
