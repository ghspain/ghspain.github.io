import React from 'react';
import { Hero, Section, Stack, AnimationProvider } from '@primer/react-brand';

const HeroSection: React.FC = () => {
  return (
    <AnimationProvider>
      <Section paddingBlockStart="none" paddingBlockEnd="none">
        <Stack>
          <Hero align="center" id="inicio">
            <Hero.Label>Comunidad</Hero.Label>
            <Hero.Heading>GitHub Community Spain</Hero.Heading>
            <Hero.Description>
              Creemos en el poder de compartir, aprender y colaborar con otras personas que tienen los mismos intereses y objetivos que nosotros.
            </Hero.Description>
            <Hero.PrimaryAction href="https://www.meetup.com/ghspain" animate="scale-in-down">Conócenos</Hero.PrimaryAction>
            <Hero.Image
              position="inline-end"
              src="https://ghspain.github.io/images/events/S1_07231.webp"
              alt="placeholder, blank area with a gray background color"
              style={{ height: '100%' }}
              animate="slide-in-left"
            />
          </Hero>
        </Stack>
      </Section>
    </AnimationProvider>
  );
};

export default HeroSection;
