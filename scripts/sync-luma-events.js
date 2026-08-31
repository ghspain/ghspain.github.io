#!/usr/bin/env node

/**
 * Script para sincronizar los eventos de Luma (calendario) a un archivo JSON.
 *
 * Descarga el archivo .ics del calendario de Luma, lo parsea y extrae de cada
 * evento (VEVENT): título, fecha de inicio, fecha de fin, URL, descripción,
 * ubicación y UID. El resultado se guarda como un array de objetos JSON.
 *
 * Se ejecuta diariamente desde una GitHub Action.
 *
 * Uso:
 *   node scripts/sync-luma-events.js [ruta_de_salida]
 *
 * Por defecto escribe en: public/data/events.json
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuración por defecto
const DEFAULT_CONFIG = {
  icsUrl: 'https://api.luma.com/ics/get?entity=calendar&id=cal-npVDfxKR0AM0dgX',
  outputPath: 'public/data/events.json'
};

/**
 * Descarga el contenido de una URL usando https.
 * @param {string} url
 * @returns {Promise<string>}
 */
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      // Seguir redirecciones (Luma puede redirigir)
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        fetchUrl(res.headers.location).then(resolve, reject);
        return;
      }

      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error(`Error HTTP ${res.statusCode} al descargar ${url}`));
        return;
      }

      let data = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    });

    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy(new Error('Timeout al descargar el archivo .ics'));
    });
  });
}

/**
 * Despliega las líneas continuadas de un archivo ICS.
 * En el formato ICS, una línea que empieza por espacio o tab es la
 * continuación de la línea anterior.
 * @param {string} content
 * @returns {string[]}
 */
function unfoldLines(content) {
  return content
    .replace(/\r\n/g, '\n')
    .split('\n')
    .reduce((acc, line) => {
      if ((line.startsWith(' ') || line.startsWith('\t')) && acc.length > 0) {
        acc[acc.length - 1] += line.slice(1);
      } else {
        acc.push(line);
      }
      return acc;
    }, []);
}

/**
 * Decodifica los valores escapados del formato ICS.
 * @param {string} value
 * @returns {string}
 */
function unescapeICS(value) {
  return value
    .replace(/\\n/gi, '\n')
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\\\/g, '\\');
}

/**
 * Convierte una fecha ICS a un objeto Date.
 * Soporta formatos con y sin zona horaria (Z = UTC).
 * @param {string} icsDate
 * @returns {Date | null}
 */
function parseICSDate(icsDate) {
  if (!icsDate) return null;

  // Formato: 20260831T120000Z (UTC) o 20260831T120000 (local)
  const match = icsDate.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z?)$/);
  if (!match) return null;

  const [, year, month, day, hour, minute, second, tz] = match;

  if (tz === 'Z') {
    // Fecha en UTC
    return new Date(Date.UTC(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second)
    ));
  }

  // Fecha local (se interpreta en la zona horaria del sistema)
  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second)
  );
}

/**
 * Formatea un Date a ISO 8601 (para JSON).
 * @param {Date} date
 * @returns {string}
 */
function toISO(date) {
  return date ? date.toISOString() : null;
}

/**
 * Extrae el valor de una propiedad de un bloque de líneas.
 * @param {string[]} lines
 * @param {string} name Nombre de la propiedad (p. ej. 'SUMMARY')
 * @returns {string | null}
 */
function getProperty(lines, name) {
  const prefix = name + ':';
  for (const line of lines) {
    if (line.startsWith(prefix)) {
      return line.slice(prefix.length);
    }
  }
  return null;
}

/**
 * Extrae la URL del evento.
 * Luma no incluye una propiedad URL directa en el ICS, así que la derivamos:
 *   1. De la propiedad URL si existe.
 *   2. Del UID (formato evt-XXXX@events.lu.ma -> https://lu.ma/event/evt-XXXX).
 *   3. De la descripción (suele contener "Get up-to-date information at: <url>").
 * @param {object} ev
 * @returns {string | null}
 */
function extractEventUrl(ev) {
  if (ev.URL) return ev.URL;

  // Derivar del UID
  if (ev.UID) {
    const uidMatch = ev.UID.match(/^(evt-[^@]+)@/);
    if (uidMatch) {
      return `https://lu.ma/event/${uidMatch[1]}`;
    }
  }

  // Buscar en la descripción
  if (ev.DESCRIPTION) {
    const descMatch = ev.DESCRIPTION.match(/https:\/\/luma\.com\/[^\s]+/);
    if (descMatch) {
      return descMatch[0];
    }
  }

  return null;
}

/**
 * Parsea el contenido ICS y devuelve un array de eventos.
 * @param {string} content
 * @returns {Array<object>}
 */
function parseICS(content) {
  const lines = unfoldLines(content);
  const events = [];

  let currentEvent = null;

  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') {
      currentEvent = {};
    } else if (line === 'END:VEVENT') {
      if (currentEvent) {
        events.push(currentEvent);
        currentEvent = null;
      }
    } else if (currentEvent) {
      // Guardar la línea completa para poder parsear propiedades con parámetros
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) continue;

      const namePart = line.slice(0, colonIndex);
      const value = line.slice(colonIndex + 1);

      // El nombre puede tener parámetros (p. ej. DTSTART;TZID=Europe/Madrid)
      const name = namePart.split(';')[0];

      currentEvent[name] = value;
    }
  }

  return events.map((ev) => {
    const start = parseICSDate(ev.DTSTART);
    const end = parseICSDate(ev.DTEND);

    return {
      uid: ev.UID || null,
      title: ev.SUMMARY ? unescapeICS(ev.SUMMARY) : null,
      start: toISO(start),
      end: toISO(end),
      url: extractEventUrl(ev),
      description: ev.DESCRIPTION ? unescapeICS(ev.DESCRIPTION) : null,
      location: ev.LOCATION ? unescapeICS(ev.LOCATION) : null
    };
  });
}

/**
 * Función principal.
 */
async function main() {
  const outputPath = process.argv[2] || DEFAULT_CONFIG.outputPath;
  const absoluteOutputPath = path.resolve(process.cwd(), outputPath);

  console.log(`📅 Descargando calendario de Luma...`);
  console.log(`   URL: ${DEFAULT_CONFIG.icsUrl}`);

  try {
    const content = await fetchUrl(DEFAULT_CONFIG.icsUrl);
    console.log(`   Descargado (${content.length} bytes)`);

    const events = parseICS(content);
    console.log(`   Eventos encontrados: ${events.length}`);

    // Ordenar por fecha de inicio (más antiguos primero)
    events.sort((a, b) => {
      const da = a.start ? new Date(a.start).getTime() : 0;
      const db = b.start ? new Date(b.start).getTime() : 0;
      return da - db;
    });

    // Asegurar que el directorio de salida existe
    fs.mkdirSync(path.dirname(absoluteOutputPath), { recursive: true });

    // Escribir el JSON
    fs.writeFileSync(
      absoluteOutputPath,
      JSON.stringify(events, null, 2) + '\n',
      'utf8'
    );

    console.log(`✅ JSON guardado en: ${absoluteOutputPath}`);
    console.log('');
    console.log('📄 Resumen de eventos:');
    events.forEach((ev, i) => {
      console.log(`   ${i + 1}. ${ev.title} (${ev.start})`);
    });
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main();
