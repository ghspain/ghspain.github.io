import React from 'react';
import { AnchorNav } from '@primer/react-brand';

const Navigation: React.FC = () => {
  return (
    <AnchorNav>
      <AnchorNav.Link href="#inicio">Inicio</AnchorNav.Link>
      <AnchorNav.Link href="#que-hacemos">¿Qué hacemos?</AnchorNav.Link>
      <AnchorNav.Link href="#eventos">Eventos</AnchorNav.Link>
      <AnchorNav.Link href="#quienes-somos">¿Quiénes somos?</AnchorNav.Link>
      <AnchorNav.Action href="https://www.meetup.com/ghspain">Meet up</AnchorNav.Action>
      <AnchorNav.SecondaryAction href="https://docs.google.com/forms/d/e/1FAIpQLSd-xUeagozDG_Hs83VK80FTnXE2FoumvixP6cskKHQuUC37Mw/viewform?usp=dialog" >Participa</AnchorNav.SecondaryAction>
    </AnchorNav>
  );
};

export default Navigation;
