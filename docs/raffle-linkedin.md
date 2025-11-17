## Sorteo de merchandising desde reacciones de LinkedIn

Este documento recoge el análisis, las limitaciones y la propuesta de implementación para añadir a la web un apartado que permita "sortear" (elegir aleatoriamente) un usuario de LinkedIn que haya reaccionado a un post concreto.

---

## Resumen rápido

- Objetivo: crear una página que permita introducir la URL de un post de LinkedIn y, al pulsar "Sortear", devuelva aleatoriamente un usuario que haya reaccionado al post.
- Restricción clave: la API oficial de LinkedIn permite recuperar acciones sociales (reacciones, comentarios) solo cuando el post es del miembro autenticado o cuando el miembro autenticado está mencionado. No es posible, en general, consultar las reacciones de cualquier post público sin permisos especiales.
- Recomendación MVP: implementar primero un modo "manual" (front-end) para elegir aleatoriamente entre una lista pegada por el organizador. En 2ª fase, integrar OAuth + backend para automatizar con LinkedIn cuando sea posible.

---

## Hallazgos técnicos (apoyados en la documentación oficial)

- Endpoint relevante: `GET https://api.linkedin.com/v2/socialActions/{postURN}` — devuelve resumen de acciones sociales del post.
- Condición de acceso habitual: el post debe ser propiedad del miembro autenticado o el miembro autenticado debe estar mencionado en el post. En caso contrario la API devuelve 403.
- Las APIs de comunidad/marketing tienen límites de uso y scopes que requieren registrar una app y posiblemente pasar por revisión de LinkedIn.
- Alternativas no oficiales (scraping, servicios de terceros) existen pero presentan riesgos de TOS y fragilidad.

---

## Opciones de diseño (evaluación)

1) OAuth + Backend (recomendado para automatización completa)
   - Pros: automático, UX superior.
   - Contras: requiere registrar app, manejar OAuth, alojar backend serverless o servidor, posible revisión por LinkedIn y permisos adicionales.
   - Notas: en muchos casos solo funcionará si el autor del post autoriza la app.

2) Frontend-only con PKCE
   - Pros: evita backend para el flujo de autorización.
   - Contras: CORS, tokens en cliente y mismas limitaciones de acceso a posts ajenos.

3) Modo manual (MVP)
   - Pros: inmediato, funciona sin credenciales ni backend.
   - Contras: trabajo manual por parte del organizador (copiar/pegar la lista de participantes).

4) Scraping o terceros (no recomendado)
   - Pros: puede recuperar datos sin consentimiento explícito del autor.
   - Contras: riesgo legal/terms of service, fragilidad y coste.

---

## Arquitectura propuesta

MVP (rápido, se puede integrar hoy mismo en `ghspain.github.io`):
- Frontend React (nueva página) en `src/components/RafflePage.tsx`.
- UI: campo para URL del post, modo selección: "Manual" (textarea/CSV) y botón "Sortear".
- Lógica: parsear lista de participantes, validaciones mínimas, seleccionar aleatorio y mostrar resultado.
- No requiere backend; funciona en GitHub Pages.

Automatización completa (fase 2):
- Backend serverless (Vercel/Netlify/Cloudflare) con endpoints:
  - OAuth callbacks y almacenamiento seguro de tokens.
  - `POST /api/raffle` que recibe `postUrl` y devuelve participante aleatorio usando `socialActions/{postURN}`.
- Frontend: botones para iniciar OAuth y solicitar sorteo al backend.
- Requisitos: `client_id`, `client_secret`, `REDIRECT_URI`, scopes apropiados y posible revisión de app por LinkedIn.

---

## Contrato (inputs/outputs)

- Endpoint (backend) — `POST /api/raffle`
  - Input JSON:
    - `postUrl` (string): URL del post de LinkedIn.
    - `mode` ("api" | "manual")
    - `participants` (Array) — solo en modo manual: lista de participantes { name?, profileUrl?, id? }
  - Output JSON:
    - `winner`: { name?, profileUrl?, urn?, avatar? }
    - `count`: número de participantes
    - `seed?`: opcional, para reproducibilidad
    - `error?`: mensaje en caso de fallo

- Frontend (UI):
  - Input: URL del post o textarea con lista manual.
  - Output visible: tarjeta con ganador y botón para abrir su perfil.

---

## Casos límite y verificaciones

- Post no perteneciente al token autenticado → la API devuelve 403. Mostrar mensaje claro y fallback al modo manual.
- Post sin reacciones → informar (no hay participantes).
- Reacciones paginadas → backend debe manejar paginación para recopilar la lista completa.
- Rate limits → aplicar backoff/retries y exponer límites al usuario.
- Privacidad → no exponer tokens en cliente; registrar el mínimo requerido y borrar logs sensibles.

---

## Pasos técnicos para implementar el MVP manual (rápido)

1. Añadir componente React `src/components/RafflePage.tsx` con:
   - Campo `postUrl` (solo informativo)
   - Textarea para pegar participantes (una línea por perfil o JSON)
   - Botón "Sortear" que valida y selecciona aleatorio
   - Mostrar resultado con link al perfil
2. Añadir enlace a `Navigation.tsx` para acceder a la nueva página
3. Añadir test mínimo en `src/__tests__` o usar `App.test.tsx` como referencia
4. Hacer build y comprobar `npm run build`

---

## Implementaciones realizadas (MVP)

He implementado un MVP manual y adapté la navegación para que el sorteo sea una página separada. Cambios realizados en el repositorio:

- `src/components/RaffleSection.tsx`
   - Nuevo componente React que contiene:
      - campo `postUrl` (informativo),
      - `textarea` para pegar la lista manual de participantes (una línea por participante),
      - botón "Sortear (manual)" que selecciona aleatoriamente un participante y muestra el resultado.

- `src/components/index.ts`
   - Exportado `RaffleSection` desde el índice de componentes para poder importarlo desde otras páginas.

- `src/pages/RafflePage.tsx`
   - Nueva página dedicada que renderiza únicamente `RaffleSection`. Accesible en la ruta `/raffle`.

- `src/App.tsx`
   - Modificado para renderizar la página independiente cuando `window.location.pathname === '/raffle'`. Si no, renderiza la web normal.

- `src/components/Navigation.tsx`
   - El enlace `Sorteo` ahora apunta a `/raffle` y permanece oculto por defecto con `style={{ display: 'none' }}`. Cuando lo actives en la navegación, llevará a la página independiente.

- `docs/raffle-linkedin.md`
   - Actualizado (este archivo) para incluir el resultado del trabajo y la documentación del MVP.

Resultado de la verificación:

- Ejecuté `npm run build` después de los cambios y la compilación fue exitosa. Aparecieron advertencias de ESLint ya existentes en otros componentes, pero no hubo errores de compilación.

Cómo activar la navegación / reactivar el enlace "Sorteo":

1. Editar el archivo `src/components/Navigation.tsx` y eliminar `style={{ display: 'none' }}` del enlace:

    - Antes:

       ```tsx
       <AnchorNav.Link href="/raffle" style={{ display: 'none' }}>Sorteo</AnchorNav.Link>
       ```

    - Después:

       ```tsx
       <AnchorNav.Link href="/raffle">Sorteo</AnchorNav.Link>
       ```

2. (Opcional, recomendado) Alternativa más flexible: renderizar el enlace condicionalmente usando una variable de entorno (por ejemplo `process.env.REACT_APP_ENABLE_RAFFLE === 'true'`). Esto permite activarlo sin tocar el código fuente, solo cambiando la variable y recompilando.

Notas y próximos pasos recomendados:

- Si quieres automatizar la obtención de participantes desde LinkedIn, la siguiente fase es preparar el backend/OAuth (ver la sección "Pasos para automatizar con LinkedIn (fase 2)").
- Puedo ahora:
   - hacer el cambio para activar el enlace mediante una variable de entorno (rápido), o
   - pulir estilos del componente para que encaje con el resto del sitio, o
   - preparar el esqueleto del backend serverless para iniciar el flujo OAuth.


## Pasos para automatizar con LinkedIn (fase 2)

1. Registrar app en LinkedIn Developers (obtener `client_id` y `client_secret`)
2. Definir scopes necesarios (ej. lectura de socialActions — revisar docs y requerimientos de LinkedIn)
3. Implementar backend serverless:
   - Endpoint para iniciar OAuth
   - Callback que almacena token de manera segura
   - Endpoint `POST /api/raffle` que acepta `postUrl`, obtiene `postURN`, llama `GET /v2/socialActions/{postURN}` y recupera reacciones
   - Manejar paginación y transformar reacciones a lista de participantes
   - Seleccionar aleatorio y devolver resultado
4. Desplegar backend y actualizar frontend para llamar al endpoint
5. Documentar el flujo y permisos necesarios

---

## Requerimientos / Preguntas para el usuario

- ¿Quieres que implemente primero el MVP manual integrado en este repo? (recomendado — muy rápido y se puede usar ya en GitHub Pages)
- Si prefieres la integración automática: ¿vas a registrar la app de LinkedIn o quieres que te guíe para hacerlo? Necesitaré `client_id`, `client_secret` y la `REDIRECT_URI` para pruebas.
- ¿Deseas que la página esté enlazada desde la navegación principal (`Navigation.tsx`) o solo accesible por URL inicialmente?

---

## Siguientes pasos sugeridos

- Si eliges MVP manual: implemento `RafflePage.tsx`, añado enlace en `Navigation.tsx`, pruebo `npm run build` y subo los cambios.
- Si eliges automatizar: preparo el esqueleto de la función serverless y documentación para registrar la app en LinkedIn.

---

## Notas finales

- Evitar scraping: recomendamos la vía OAuth+API o el modo manual para respetar TOS y privacidad.
- Este documento está en `docs/docs/feats/raffle-linkedin.md` dentro del repositorio. Copia o adapta el contenido para añadir instrucciones de despliegue o ejemplos concretos de payload cuando configuremos el backend.

