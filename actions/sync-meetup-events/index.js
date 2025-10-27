#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const cheerio = require('cheerio');

/**
 * Obtiene la imagen del evento desde la página de Meetup
 */
function getEventImage(eventLink) {
  return new Promise((resolve, reject) => {
    if (!eventLink || !eventLink.includes('meetup.com')) {
      resolve(null);
      return;
    }

    https.get(eventLink, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const $ = cheerio.load(data);
          const ogImage = $('meta[property="og:image"]').attr('content');
          resolve(ogImage || null);
        } catch (error) {
          console.warn(`Error parsing HTML for ${eventLink}:`, error.message);
          resolve(null);
        }
      });
    }).on('error', (error) => {
      console.warn(`Error fetching ${eventLink}:`, error.message);
      resolve(null);
    });
  });
}

/**
 * Scrape eventos de Meetup usando Puppeteer
 */
async function scrapeMeetupEvents() {
  console.log('🚀 Iniciando scraping de eventos de Meetup...');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  try {
  const page = await browser.newPage();
  // Leer organización desde input de la acción (env var INPUT_MEETUP_ORG)
  const meetupOrg = process.env.INPUT_MEETUP_ORG || 'ghspain';
  const meetupUrl = `https://www.meetup.com/${meetupOrg}/events/`;
  await page.goto(meetupUrl, { waitUntil: 'networkidle2', timeout: 60000 });

    // Esperar a que cargue
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Extraer eventos
    const events = await page.evaluate(() => {
      const eventCards = document.querySelectorAll('[data-testid="event-card"]');
      const scrapedEvents = [];

      eventCards.forEach(card => {
        const linkElement = card.querySelector('a[href*="/events/"]');
        if (linkElement) {
          const link = linkElement.href;
          const eventId = link.split('/events/')[1]?.split('/')[0] || link.split('/events/')[1]?.split('?')[0];

          const titleElement = card.querySelector('[data-testid="event-card-title"]') || card.querySelector('h2') || card.querySelector('h3');
          const title = titleElement ? titleElement.textContent.trim() : '';

          const dateElement = card.querySelector('[data-testid="event-card-date"]') || card.querySelector('time');
          const dateText = dateElement ? dateElement.textContent.trim() : '';

          if (eventId && title && dateText) {
            scrapedEvents.push({
              event_id: eventId,
              event_name: title,
              event_link: link,
              event_date: dateText // Necesitará parsing
            });
          }
        }
      });

      return scrapedEvents;
    });

    console.log(`📊 Encontrados ${events.length} eventos en Meetup`);
    return events;

  } finally {
    await browser.close();
  }
}

/**
 * Parsea fecha de texto a formato MM/DD/YYYY H:MM AM/PM
 */
function parseMeetupDate(dateText) {
  // Ejemplo: "Tue, Oct 28 · 5:45 PM CET"
  const match = dateText.match(/(\w+), (\w+) (\d+) · (\d+):(\d+) (AM|PM)/);
  if (match) {
    const [, , month, day, hour, minute, ampm] = match;
    const monthMap = {
      Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
      Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
    };
    const monthNum = monthMap[month];
    const year = '2025'; // Asumir 2025
    return `${monthNum}/${day}/${year} ${hour}:${minute}:00 ${ampm}`;
  }
  return dateText; // Fallback
}

/**
 * Sincroniza eventos de Meetup
 */
async function syncMeetupEvents() {
  try {
    // Permitir override por input de la acción (env var INPUT_JSON_PATH)
    const jsonPathInput = process.env.INPUT_JSON_PATH || 'public/data/issues.json';
    const jsonPath = path.join(process.cwd(), jsonPathInput);

    // Cargar eventos existentes
    const existingEvents = fs.existsSync(jsonPath) ? JSON.parse(fs.readFileSync(jsonPath, 'utf8')) : [];

    // Scrape nuevos eventos
    const scrapedEvents = await scrapeMeetupEvents();

    // Procesar y agregar nuevos eventos
    for (const scraped of scrapedEvents) {
      const existingIndex = existingEvents.findIndex(e => e.event_id === scraped.event_id);

      if (existingIndex === -1) {
        // Nuevo evento
        const parsedDate = parseMeetupDate(scraped.event_date);
        const eventData = {
          event_id: scraped.event_id,
          event_name: scraped.event_name,
          event_link: scraped.event_link,
          event_date: parsedDate
        };

        // Obtener imagen
        console.log(`📸 Obteniendo imagen para nuevo evento: ${scraped.event_name}`);
        const imageUrl = await getEventImage(scraped.event_link);
        if (imageUrl) {
          eventData.event_image = imageUrl;
        }

        existingEvents.push(eventData);
        console.log(`➕ Evento añadido: ${scraped.event_id} - ${scraped.event_name}`);
      }
    }

    // Actualizar imágenes de eventos existentes sin imagen
    for (const event of existingEvents) {
      if (!event.event_image && event.event_link) {
        console.log(`📸 Actualizando imagen para: ${event.event_name}`);
        const imageUrl = await getEventImage(event.event_link);
        if (imageUrl) {
          event.event_image = imageUrl;
        }
      }
    }

    // Ordenar por fecha descendente
    existingEvents.sort((a, b) => new Date(b.event_date) - new Date(a.event_date));

    // Guardar
    const dir = path.dirname(jsonPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(jsonPath, JSON.stringify(existingEvents, null, 2), 'utf8');

    console.log(`✅ Sincronización completa: ${existingEvents.length} eventos en ${jsonPath}`);

  } catch (error) {
    console.error('❌ Error en sincronización:', error.message);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  syncMeetupEvents();
}

module.exports = { syncMeetupEvents };