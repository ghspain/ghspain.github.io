import React from 'react';
import { Section, Stack, Animate, SectionIntro } from '@primer/react-brand';
import { Card } from './subcomponents/Card';

const CardsSection: React.FC = () => {
  return (
    <Section paddingBlockStart="none" paddingBlockEnd="normal" id="que-hacemos">
      <SectionIntro align="center">
        <SectionIntro.Heading size="3">¿Que hacemos?</SectionIntro.Heading>
        <SectionIntro.Description>Fomentamos la cultura del aprendizaje continuo, la curiosidad y la experimentación. Animamos a todos los miembros de nuestra comunidad a que se involucren en el proceso de enseñar y aprender, tanto dentro como fuera de nuestra red.</SectionIntro.Description>
      </SectionIntro>
      <Stack
        direction={{
          narrow: 'vertical',
          regular: 'vertical',
          wide: 'horizontal',
        }}
        padding="spacious"
        alignItems="center"
        justifyContent="center"
        gap="normal"

      >
        <Animate animate="scale-in-up">
          <Card href="https://www.meetup.com/ghspain" hasBorder ctaText="Saber más" fullWidth align="center">
            <Card.Heading>Altruista y generosa</Card.Heading>
            <Card.Description>Nadie en la organización obtiene algún tipo de beneficio monetario de la misma. Queremos aportar valor al conjunto de la sociedad y al sector tecnológico con nuestros proyectos, nuestras ideas y nuestras experiencias.</Card.Description>
          </Card>
        </Animate>
        <Animate animate="scale-in-up">
          <Card href="https://www.meetup.com/ghspain" hasBorder ctaText="Saber más" fullWidth align="center">
            <Card.Heading>Abierta y participativa</Card.Heading>
            <Card.Description>Cualquier persona que quiera colaborar y ayudar a dinamizar nuestra comunidad es bienvenida. Queremos expandir nuestra red por diferentes lugares y ciudades de España, para llegar a más personas y crear más oportunidades.</Card.Description>
          </Card>
        </Animate>
        <Animate animate="scale-in-up">
          <Card href="https://www.meetup.com/ghspain" hasBorder ctaText="Saber más" fullWidth align="center">
            <Card.Heading>Basada en Github</Card.Heading>
            <Card.Description>GitHub nos permite gestionar nuestros proyectos, documentar nuestro trabajo y compartir nuestro código con otros desarrolladores. Reconocemos el valor de GitHub como herramienta, como filosofía y como un pilar fundamental para el desarrollo.</Card.Description>
          </Card>
        </Animate>
      </Stack>
    </Section>
  );
};

export default CardsSection;
