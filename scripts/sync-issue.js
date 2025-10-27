#!/usr/bin/env node

const { syncIssue, parseIssueContent, shouldProcessIssue, updateEventImages } = require('../actions/sync-issue/lib/core');

// Si se ejecuta con argumento 'update-images'
if (require.main === module && process.argv[2] === 'update-images') {
  updateEventImages().catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
}

/**
 * Script para sincronizar un issue de GitHub al archivo JSON
 * Parsea el formato específico donde:
 * - El título contiene el ID del evento
 * - El cuerpo contiene: nombre_evento;enlace;fecha
 */

// Si se ejecuta directamente (desde línea de comandos)
if (require.main === module) {
  const command = process.argv[2];
  
  if (command === 'update-images') {
    updateEventImages().catch(error => {
      console.error('❌ Error:', error.message);
      process.exit(1);
    });
  } else {
    // Código original para sync issue
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
}

module.exports = { syncIssue, parseIssueContent, shouldProcessIssue };
