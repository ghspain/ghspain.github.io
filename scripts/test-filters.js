#!/usr/bin/env node

// Test simple para verificar los filtros
const { shouldProcessIssue } = require('./sync-issue');

console.log('🧪 Testeando filtros de issues...\n');

// Test 1: Issue válido (autor correcto + label correcto)
const validIssue = {
  number: 1,
  user: { login: 'ghspain-user' },
  labels: [{ name: 'Event' }, { name: 'important' }]
};

console.log('Test 1 - Issue válido:');
console.log('Resultado:', shouldProcessIssue(validIssue) ? '✅ VÁLIDO' : '❌ RECHAZADO');
console.log();

// Test 2: Autor incorrecto
const wrongAuthor = {
  number: 2,
  user: { login: 'otrapersona' },
  labels: [{ name: 'Event' }]
};

console.log('Test 2 - Autor incorrecto:');
console.log('Resultado:', shouldProcessIssue(wrongAuthor) ? '✅ VÁLIDO' : '❌ RECHAZADO');
console.log();

// Test 3: Sin label "Event"
const wrongLabel = {
  number: 3,
  user: { login: 'ghspain-user' },
  labels: [{ name: 'bug' }, { name: 'important' }]
};

console.log('Test 3 - Sin label "Event":');
console.log('Resultado:', shouldProcessIssue(wrongLabel) ? '✅ VÁLIDO' : '❌ RECHAZADO');
console.log();

// Test 4: Autor correcto pero sin labels
const noLabels = {
  number: 4,
  user: { login: 'ghspain-user' },
  labels: []
};

console.log('Test 4 - Sin labels:');
console.log('Resultado:', shouldProcessIssue(noLabels) ? '✅ VÁLIDO' : '❌ RECHAZADO');
console.log();

// Test 5: Label "event" en minúsculas (debería funcionar)
const lowercaseLabel = {
  number: 5,
  user: { login: 'ghspain-user' },
  labels: [{ name: 'event' }]
};

console.log('Test 5 - Label "event" en minúsculas:');
console.log('Resultado:', shouldProcessIssue(lowercaseLabel) ? '✅ VÁLIDO' : '❌ RECHAZADO');
console.log();
