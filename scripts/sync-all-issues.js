#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const { syncIssue, shouldProcessIssue } = require('./sync-issue');

/**
 * Script para sincronizar TODOS los issues existentes de un repositorio de GitHub
 * Se puede ejecutar manualmente o desde GitHub Actions
 */

// Configuración por defecto
const DEFAULT_CONFIG = {
  owner: 'alexcerezo',
  repo: 'ghspain',
  outputPath: 'public/data/issues.json'
};

function makeGitHubRequest(endpoint, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: endpoint,
      method: 'GET',
      headers: {
        'User-Agent': 'GitHub-Issues-Sync/1.0',
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          
          if (res.statusCode !== 200) {
            reject(new Error(`GitHub API error: ${res.statusCode} - ${parsedData.message || 'Unknown error'}`));
            return;
          }
          
          resolve(parsedData);
        } catch (error) {
          reject(new Error(`Error parsing JSON: ${error.message}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
}

async function fetchAllIssues(owner, repo, token = null) {
  const issues = [];
  let page = 1;
  const perPage = 100;
  
  console.log(`🔍 Obteniendo issues del repositorio ${owner}/${repo}...`);
  
  while (true) {
    const endpoint = `/repos/${owner}/${repo}/issues?state=all&per_page=${perPage}&page=${page}`;
    
    try {
      const pageIssues = await makeGitHubRequest(endpoint, token);
      
      if (!Array.isArray(pageIssues) || pageIssues.length === 0) {
        break;
      }
      
      // Filtrar pull requests
      const realIssues = pageIssues.filter(issue => !issue.pull_request);
      issues.push(...realIssues);
      
      console.log(`📄 Página ${page}: ${realIssues.length} issues encontrados (${issues.length} total)`);
      
      if (pageIssues.length < perPage) {
        break;
      }
      
      page++;
    } catch (error) {
      throw new Error(`Error fetching page ${page}: ${error.message}`);
    }
  }
  
  return issues;
}

async function syncAllIssues() {
  try {
    // Obtener configuración desde variables de entorno o usar por defecto
    const owner = process.env.GITHUB_REPOSITORY_OWNER || process.env.REPO_OWNER || DEFAULT_CONFIG.owner;
    const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] || process.env.REPO_NAME || DEFAULT_CONFIG.repo;
    const outputPath = process.env.OUTPUT_PATH || DEFAULT_CONFIG.outputPath;
    const token = process.env.GITHUB_TOKEN;
    
    console.log(`🚀 Iniciando sincronización completa de issues`);
    console.log(`📂 Repositorio: ${owner}/${repo}`);
    console.log(`💾 Archivo de salida: ${outputPath}`);
    
    // Obtener todos los issues del repositorio
    const allIssues = await fetchAllIssues(owner, repo, token);
    
    if (allIssues.length === 0) {
      console.log('ℹ️ No se encontraron issues en el repositorio');
      return;
    }
    
    console.log(`📊 Total de issues encontrados: ${allIssues.length}`);
    console.log('🔄 Iniciando sincronización...');
    
    // Borrar el archivo existente para empezar de cero
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
      console.log('🗑️ Archivo existente eliminado');
    }
    
    // Filtrar issues que cumplen los criterios (autor: alexcerezo, label: Event)
    const filteredIssues = allIssues.filter(issue => shouldProcessIssue(issue));
    
    console.log(`📊 Issues filtrados: ${filteredIssues.length}/${allIssues.length} (autor: alexcerezo, label: Event)`);
    
    if (filteredIssues.length === 0) {
      console.log('ℹ️ No se encontraron issues que cumplan los filtros (autor: alexcerezo, label: Event)');
      return;
    }
    
    // Sincronizar cada issue filtrado
    let syncedCount = 0;
    for (const issue of filteredIssues) {
      try {
        await syncIssue(issue, 'bulk_sync', outputPath);
        syncedCount++;
        
        // Mostrar progreso cada 10 issues
        if (syncedCount % 10 === 0) {
          console.log(`⏳ Progreso: ${syncedCount}/${filteredIssues.length} issues sincronizados`);
        }
      } catch (error) {
        console.error(`❌ Error sincronizando issue #${issue.number}:`, error.message);
      }
    }
    
    console.log(`✅ Sincronización completa: ${syncedCount}/${filteredIssues.length} issues sincronizados`);
    console.log(`📁 Archivo guardado en: ${outputPath}`);
    
  } catch (error) {
    console.error('❌ Error durante la sincronización:', error.message);
    
    if (error.message.includes('rate limit')) {
      console.log('💡 Consejo: El token de GitHub ayuda a evitar límites de API');
    }
    
    if (error.message.includes('Not Found')) {
      console.log('💡 Verifica que el repositorio existe y es accesible');
    }
    
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  syncAllIssues();
}

module.exports = { syncAllIssues, fetchAllIssues };
