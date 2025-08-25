import React from 'react';
import { Link, Heading, Text, Section, Stack, AnimationProvider, SectionIntro } from '@primer/react-brand';
import { River } from './subcomponents/River';


const RiverSection: React.FC = () => {
  return (
    <Section paddingBlockStart="none" paddingBlockEnd="spacious" id="quienes-somos">
      <SectionIntro align="center">
        <SectionIntro.Heading size="3">¿Quiénes somos?</SectionIntro.Heading>
      </SectionIntro>
      <Stack>
        <AnimationProvider>
          <River imageTextRatio="40:60">
            <River.Visual>
              <img src={`${process.env.PUBLIC_URL}/images/organizers/svg153.webp`} alt="Sergio Valverde" />
            </River.Visual>
            <River.Content animate="slide-in-right">
              <Heading>Sergio Valverde</Heading>
              <Text>
                Organizador. Ingeniero de Plataforma en Lunik y organizador de GitHub Community Spain, con experiencia en infraestructura, SRE y automatización. Apasionado por DevOps, la experiencia del desarrollador y el enfoque Everything as Code.
              </Text>
              <Link href="https://github.com/svg153">GitHub</Link>
            </River.Content>
          </River>
          <River align="end" imageTextRatio="40:60">
            <River.Visual>
              <img src={`${process.env.PUBLIC_URL}/images/organizers/lfraile.webp`} alt="Luis Fraile" />
            </River.Visual>
            <River.Content animate="slide-in-left">
              <Heading>Luis Fraile</Heading>
              <Text>
                Co-organizador. CTO en B!Play y consultor DevOps y ALM en Plain Concepts.
              </Text>
              <Link href="https://github.com/lfraile">GitHub</Link>
            </River.Content>
          </River>
          <River imageTextRatio="40:60">
            <River.Visual>
              <img src={`${process.env.PUBLIC_URL}/images/organizers/micheloni.webp`} alt="Leo Micheloni" />
            </River.Visual>
            <River.Content animate="slide-in-right">
              <Heading>Leo Micheloni</Heading>
              <Text>
                Desarrollador software. Bebedor de mate y matador de teclas. MVP en cada partido que juega.
              </Text>
              <Link href="https://github.com/leomicheloni">GitHub</Link>
            </River.Content>
          </River>
          <River align="end" imageTextRatio="40:60">
            <River.Visual>
              <img src={`${process.env.PUBLIC_URL}/images/organizers/alex.webp`} alt="Alex Cerezo" />
            </River.Visual>
            <River.Content animate="slide-in-left">
              <Heading>Alex Cerezo</Heading>
              <Text>
                Co-Organizador. Ingeniero de Software y especialista en IA. Team Lead especializado en LLMs y desarrollo full-stack.
              </Text>
              <Link href="https://github.com/alexcerezo">GitHub</Link>
            </River.Content>
          </River>
        </AnimationProvider>
      </Stack>
    </Section>
  );
};

export default RiverSection;
