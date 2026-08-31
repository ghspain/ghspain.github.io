import { useState, useRef } from 'react';
import { AnimationProvider, Checkbox, FormControl, Radio, Section, SectionIntro, Stack, Text, TextInput, Button, Textarea } from '@primer/react-brand';

const FormSection: React.FC = () => {
    const [result, setResult] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const successRef = useRef<HTMLDivElement>(null);

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        formData.append("access_key", "eadd6332-1c6f-4925-a620-816efeb26a0f");

        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        setResult(data.success ? "Success!" : "Error");
        if (data.success) {
            formRef.current?.reset();
            setSubmitted(true);
            setTimeout(() => {
                successRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    };

    return (
        <AnimationProvider>
            <Section paddingBlockStart="spacious" paddingBlockEnd="spacious" id="participa">
                <SectionIntro align="center">
                    <SectionIntro.Heading size="3">Participa</SectionIntro.Heading>
                    <SectionIntro.Description>
                        Si estás interesado en dar una charla con GitHub Community Spain, puedes presentar tu propuesta usando este formulario.
                    </SectionIntro.Description>
                </SectionIntro>
                <Stack>
                    <form ref={formRef} onSubmit={onSubmit}>
                            <div
                                style={{
                                    alignItems: 'center',
                                    display: 'grid',
                                    gap: 16,
                                    margin: '0 auto ',
                                    maxWidth: 600,
                                }}
                            >
                                <Text as="p" variant="muted">
                                    Todos los campos marcados con un asterisco (*) son obligatorios
                                </Text>
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1.5fr',
                                        gap: 16,
                                    }}
                                >
                                    <FormControl fullWidth required>
                                        <FormControl.Label>Nombre</FormControl.Label>
                                        <TextInput name="nombre" required autoComplete="given-name" />
                                    </FormControl>
                                    <FormControl fullWidth required>
                                        <FormControl.Label>Apellidos</FormControl.Label>
                                        <TextInput name="apellidos" required autoComplete="family-name" />
                                    </FormControl>
                                </div>

                                <FormControl fullWidth required>
                                    <FormControl.Label>Email</FormControl.Label>
                                    <TextInput name="email" required type="email" />
                                </FormControl>

                                <FormControl fullWidth required>
                                    <FormControl.Label>GitHub</FormControl.Label>
                                    <TextInput name="github" leadingText="github.com/" required />
                                </FormControl>

                                <FormControl fullWidth required>
                                    <FormControl.Label>Ciudad</FormControl.Label>
                                    <TextInput name="ciudad" required />
                                </FormControl>

                                <FormControl fullWidth required>
                                    <FormControl.Label>Titulo</FormControl.Label>
                                    <TextInput name="titulo" required />
                                </FormControl>

                                <FormControl fullWidth required>
                                    <FormControl.Label>Descripción</FormControl.Label>
                                    <Textarea name="descripcion" required />
                                </FormControl>

                                <FormControl required>
                                    <FormControl.Label>¿Tu empresa está interesada en patrocinar la charla?</FormControl.Label>
                                    <Stack direction={{ narrow: 'vertical', regular: 'horizontal' }} gap="condensed" padding="condensed">
                                        <FormControl>
                                            <FormControl.Label>Si</FormControl.Label>
                                            <Radio name="patrocinio" value="yes" />
                                        </FormControl>
                                        <FormControl>
                                            <FormControl.Label>No</FormControl.Label>
                                            <Radio name="patrocinio" value="no" />
                                        </FormControl>
                                        <FormControl>
                                            <FormControl.Label>No lo sé</FormControl.Label>
                                            <Radio name="patrocinio" value="unknown" />
                                        </FormControl>
                                    </Stack>
                                </FormControl>

                                <FormControl required>
                                    <Checkbox name="consentimiento" />
                                    <FormControl.Label>
                                        <Text variant="muted">
                                            Consiento el tratamiento de mis datos personales con el fin de poder ser contactado por GitHub Community Spain.

                                        </Text>
                                    </FormControl.Label>
                                </FormControl>

                                <Button variant="subtle" type="submit">
                                    Enviar propuesta
                                </Button>

                                {result && result !== 'Success!' && (
                                    <Text
                                        variant="muted"
                                        style={{
                                            color: '#cf222e',
                                        }}
                                    >
                                        Error al enviar la propuesta. Inténtalo de nuevo.
                                    </Text>
                                )}
                            </div>
                        </form>
                </Stack>
            </Section>
            {submitted && (
                <Section paddingBlockStart="spacious" paddingBlockEnd="spacious" id="propuesta-enviada" ref={successRef}>
                    <SectionIntro align="center">
                        <SectionIntro.Heading size="3">¡Propuesta enviada!</SectionIntro.Heading>
                        <SectionIntro.Description>
                            Gracias por tu interés en GitHub Community Spain. Revisaremos tu propuesta y te contactaremos pronto.
                        </SectionIntro.Description>
                    </SectionIntro>
                </Section>
            )}
        </AnimationProvider>
    );
};

export default FormSection;
