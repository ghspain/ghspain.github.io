#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script para sincronizar un issue de GitHub al archivo JSON
 * Parsea el formato específico donde:
 * - El título contiene el ID del evento
 * - El cuerpo contiene: nombre_evento;enlace;fecha
 */

function parseIssueContent(issue) {
  // El título es el ID del evento
  const eventId = issue.title.trim();
  
  // Parsear el cuerpo: nombre_evento;enlace;fecha
  const body = issue.body || '';
  const parts = body.split(';').map(part => part.trim());
  
  const eventName = parts[0] || '';
  const eventLink = parts[1] || '';
  const eventDate = parts[2] || '';
  
  return {
    eventId,
    eventName,
    eventLink,
    eventDate
  };
}

function shouldProcessIssue(issueData) {
  // Verificar que el autor sea el correcto
  const isCorrectAuthor = issueData.user && issueData.user.login === 'ghspain-user';
  
  // Verificar que tenga el label "Event"
  const hasEventLabel = issueData.labels && issueData.labels.some(label => 
    label.name.toLowerCase() === 'event'
  );
  
  const shouldProcess = isCorrectAuthor && hasEventLabel;
  
  if (!shouldProcess) {
    console.log(`⚠️  Issue #${issueData.number} no cumple filtros:`);
    console.log(`   - Autor: ${issueData.user?.login || 'unknown'} ${isCorrectAuthor ? '✅' : '❌'}`);
    console.log(`   - Label "Event": ${hasEventLabel ? '✅' : '❌'} (labels: ${issueData.labels?.map(l => l.name).join(', ') || 'ninguno'})`);
  }
  
  return shouldProcess;
}

function loadExistingIssues(jsonPath) {
  if (fs.existsSync(jsonPath)) {
    try {
      const content = fs.readFileSync(jsonPath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      console.warn('⚠️ Error al leer JSON existente, creando nuevo:', error.message);
    }
  }
  return [];
}

function saveIssues(jsonPath, issues) {
  // Crear el directorio si no existe
  const dir = path.dirname(jsonPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Guardar el archivo
  fs.writeFileSync(jsonPath, JSON.stringify(issues, null, 2), 'utf8');
}

function syncIssue(issueData, action, jsonPath = 'public/data/issues.json') {
  console.log(`🔄 Procesando issue #${issueData.number} (acción: ${action})`);
  
  // Verificar filtros antes de procesar
  if (!shouldProcessIssue(issueData)) {
    console.log(`⏭️  Issue #${issueData.number} omitido (no cumple los filtros)`);
    return loadExistingIssues(jsonPath); // Devolver issues existentes sin cambios
  }
  
  // Cargar issues existentes
  const existingIssues = loadExistingIssues(jsonPath);
  
  // Parsear el contenido del issue
  const parsedContent = parseIssueContent(issueData);
  
  // Crear el objeto del evento (solo los datos esenciales)
  const eventData = {
    event_id: parsedContent.eventId,
    event_name: parsedContent.eventName,
    event_link: parsedContent.eventLink,
    event_date: parsedContent.eventDate
  };
  
  // Buscar si el evento ya existe (por event_id)
  const existingIndex = existingIssues.findIndex(item => item.event_id === parsedContent.eventId);
  
  if (existingIndex >= 0) {
    // Actualizar evento existente
    existingIssues[existingIndex] = eventData;
    console.log(`✅ Evento actualizado: ${parsedContent.eventId} - ${parsedContent.eventName}`);
  } else {
    // Añadir nuevo evento
    existingIssues.push(eventData);
    console.log(`➕ Evento añadido: ${parsedContent.eventId} - ${parsedContent.eventName}`);
  }
  
  // Ordenar por event_id (que viene del título del issue)
  existingIssues.sort((a, b) => {
    // Intentar ordenar numéricamente si es posible, sino alfabéticamente
    const aId = isNaN(a.event_id) ? a.event_id : parseInt(a.event_id);
    const bId = isNaN(b.event_id) ? b.event_id : parseInt(b.event_id);
    
    if (typeof aId === 'number' && typeof bId === 'number') {
      return aId - bId;
    }
    return String(aId).localeCompare(String(bId));
  });
  
  // Guardar el archivo actualizado
  saveIssues(jsonPath, existingIssues);
  
  console.log(`📊 Total de eventos en el archivo: ${existingIssues.length}`);
  
  return existingIssues;
}

// Si se ejecuta directamente (desde línea de comandos)
if (require.main === module) {
  try {
    // Obtener los datos del issue desde las variables de entorno
    const issueJson = process.env.ISSUE_JSON;
    const action = process.env.ISSUE_ACTION || 'unknown';
    const outputPath = process.env.OUTPUT_PATH || 'public/data/issues.json';
    
    if (!issueJson) {
      throw new Error('ISSUE_JSON environment variable is required');
    }
    
    const issueData = JSON.parse(issueJson);
    syncIssue(issueData, action, outputPath);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

module.exports = { syncIssue, parseIssueContent, shouldProcessIssue };
