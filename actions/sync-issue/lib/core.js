const fs = require('fs');
const path = require('path');
const https = require('https');
const cheerio = require('cheerio');

// Fetch OG image from a Meetup event page
function getEventImage(eventLink) {
  return new Promise((resolve) => {
    if (!eventLink || !eventLink.includes('meetup.com')) {
      resolve(null);
      return;
    }
    https
      .get(eventLink, (res) => {
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
            console.warn(`Error parsing HTML for ${eventLink}: ${error.message}`);
            resolve(null);
          }
        });
      })
      .on('error', (error) => {
        console.warn(`Error fetching ${eventLink}: ${error.message}`);
        resolve(null);
      });
  });
}

// From issue payload: title -> id; body: name;link;date
async function parseIssueContent(issue) {
  const eventId = (issue.title || '').trim();
  const body = issue.body || '';
  const parts = body.split(';').map((p) => p.trim());
  const eventName = parts[0] || '';
  const eventLink = parts[1] || '';
  const eventDate = parts[2] || '';
  const eventImage = await getEventImage(eventLink);
  return { eventId, eventName, eventLink, eventDate, eventImage };
}

function shouldProcessIssue(issueData) {
  const isCorrectAuthor =
    issueData.user && (issueData.user.login === 'ghspain-user' || issueData.user.login === 'alexcerezo');
  const hasEventLabel =
    issueData.labels && issueData.labels.some((label) => label.name && label.name.toLowerCase() === 'event');
  const ok = !!(isCorrectAuthor && hasEventLabel);
  if (!ok) {
    console.log(
      `⚠️  Issue #${issueData.number} no cumple filtros: autor=${issueData.user?.login || 'unknown'}, label Event=${hasEventLabel}`
    );
  }
  return ok;
}

function loadExistingIssues(jsonPath) {
  if (fs.existsSync(jsonPath)) {
    try {
      const content = fs.readFileSync(jsonPath, 'utf8');
      return JSON.parse(content);
    } catch (e) {
      console.warn(`⚠️ Error al leer JSON existente en ${jsonPath}: ${e.message}`);
    }
  }
  return [];
}

function saveIssues(jsonPath, issues) {
  const dir = path.dirname(jsonPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(jsonPath, JSON.stringify(issues, null, 2), 'utf8');
}

async function syncIssue(issueData, action, jsonPath = 'public/data/issues.json') {
  console.log(`🔄 Procesando issue #${issueData.number} (acción: ${action})`);
  if (!shouldProcessIssue(issueData)) {
    console.log(`⏭️  Issue #${issueData.number} omitido (no cumple los filtros)`);
    return loadExistingIssues(jsonPath);
  }

  const existingIssues = loadExistingIssues(jsonPath);
  const parsed = await parseIssueContent(issueData);
  const eventData = {
    event_id: parsed.eventId,
    event_name: parsed.eventName,
    event_link: parsed.eventLink,
    event_date: parsed.eventDate,
    event_image: parsed.eventImage,
  };

  const idx = existingIssues.findIndex((e) => e.event_id === parsed.eventId);
  if (idx >= 0) {
    existingIssues[idx] = eventData;
    console.log(`✅ Evento actualizado: ${parsed.eventId} - ${parsed.eventName}`);
  } else {
    existingIssues.push(eventData);
    console.log(`➕ Evento añadido: ${parsed.eventId} - ${parsed.eventName}`);
  }

  existingIssues.sort((a, b) => {
    const aId = isNaN(a.event_id) ? a.event_id : parseInt(a.event_id, 10);
    const bId = isNaN(b.event_id) ? b.event_id : parseInt(b.event_id, 10);
    if (typeof aId === 'number' && typeof bId === 'number') return aId - bId;
    return String(aId).localeCompare(String(bId));
  });

  saveIssues(jsonPath, existingIssues);
  console.log(`📊 Total de eventos en el archivo: ${existingIssues.length}`);
  return existingIssues;
}

// Batch utility for images
async function updateEventImages(jsonPath = 'public/data/issues.json') {
  console.log(`🔄 Actualizando imágenes de eventos en ${jsonPath}...`);
  const events = loadExistingIssues(jsonPath);
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    if (event.event_link) {
      console.log(`📸 Obteniendo imagen para evento: ${event.event_name}`);
      try {
        const imageUrl = await getEventImage(event.event_link);
        if (imageUrl) {
          event.event_image = imageUrl;
          console.log(`✅ Imagen obtenida: ${imageUrl}`);
        } else {
          console.log(`⚠️ No se encontró imagen para ${event.event_name}`);
        }
      } catch (error) {
        console.error(`❌ Error obteniendo imagen para ${event.event_name}: ${error.message}`);
      }
    }
  }
  saveIssues(jsonPath, events);
  console.log(`📁 Archivo actualizado: ${jsonPath}`);
  return events;
}

module.exports = {
  getEventImage,
  parseIssueContent,
  shouldProcessIssue,
  loadExistingIssues,
  saveIssues,
  syncIssue,
  updateEventImages,
};
