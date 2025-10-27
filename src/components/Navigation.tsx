import React from 'react';
import { AnchorNav } from '@primer/react-brand';

const Navigation: React.FC = () => {
  return (
    <AnchorNav>
      <AnchorNav.Link href="#inicio">Inicio</AnchorNav.Link>
      {/* Enlace al sorteo oculto por defecto — activar cambiando el style o eliminando el display */}
      {/* Use AnchorNav.Action to avoid AnchorNav.Link internal scrolling logic that expects a hash selector */}
      <AnchorNav.Action href="/raffle" style={{ display: 'none' }}>Sorteo</AnchorNav.Action>
      <AnchorNav.Link href="#que-hacemos">¿Qué hacemos?</AnchorNav.Link>
      <AnchorNav.Link href="#eventos">Eventos</AnchorNav.Link>
      <AnchorNav.Link href="#quienes-somos">¿Quiénes somos?</AnchorNav.Link>
      <AnchorNav.Action href="https://www.meetup.com/ghspain">Meet up</AnchorNav.Action>
      <AnchorNav.SecondaryAction href="#" style={{ display: 'none' }}></AnchorNav.SecondaryAction>
    </AnchorNav>
  );
};

export default Navigation;
