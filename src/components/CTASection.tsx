import React from 'react';
import { CTABanner, Section, Stack, Button, AnimationProvider } from '@primer/react-brand';

const CTASection: React.FC = () => {
  return (
    <AnimationProvider>
    <Section paddingBlockStart="condensed" paddingBlockEnd="normal" id="eventos">
      <Stack>
        <CTABanner>
          <CTABanner.Heading>Entérate de todos nuestros eventos a través de nuestras redes</CTABanner.Heading>
          <CTABanner.Description>
            Queremos crear un espacio abierto, inclusivo y diverso donde podamos expresarnos, inspirarnos y crecer juntos. ¡Únete a nosotros y sé parte de nuestra comunidad!
          </CTABanner.Description>
          <CTABanner.ButtonGroup>
              <Button as="a" href="https://www.meetup.com/ghspain" animate="scale-in-up">Meetup</Button>
              <Button as="a" href="https://www.linkedin.com/company/ghspain/" animate="scale-in-up">LinkedIn</Button>
          </CTABanner.ButtonGroup>
        </CTABanner>
      </Stack>
    </Section>
    </AnimationProvider>
  );
};

export default CTASection;
