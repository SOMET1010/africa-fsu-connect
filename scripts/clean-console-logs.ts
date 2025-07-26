/**
 * Script de nettoyage automatisé des console.log pour Phase 3 - EMERGENCY ATTACK PLAN
 * Remplace tous les console.log par des appels au logger structuré
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const SRC_DIR = './src';

// Mapping des replacements
const CONSOLE_REPLACEMENTS = {
  'console.error': 'logger.error',
  'console.warn': 'logger.warn', 
  'console.info': 'logger.info',
  'console.log': 'logger.debug',
  'console.debug': 'logger.debug'
};

// Fichiers déjà traités manuellement
const PROCESSED_FILES = new Set([
  'VirtualAssistant.tsx',
  'CustomMetricsWidget.tsx', 
  'IndicatorsEnrichmentPanel.tsx',
  'InternationalStandardsPanel.tsx',
  'AutoEnrichmentPanel.tsx',
  'BidirectionalSyncConfig.tsx',
  'ProjectDialog.tsx',
  'ProjectExport.tsx',
  'SampleProjectData.tsx'
]);

function getAllTsxFiles(dir: string): string[] {
  const files: string[] = [];
  
  function walk(currentDir: string) {
    const items = readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = join(currentDir, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory() && !item.includes('node_modules')) {
        walk(fullPath);
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        files.push(fullPath);
      }
    }
  }
  
  walk(dir);
  return files;
}

function cleanConsoleInFile(filePath: string): boolean {
  const fileName = filePath.split('/').pop() || '';
  
  if (PROCESSED_FILES.has(fileName)) {
    console.log(`⏭️  Skipping ${fileName} (already processed)`);
    return false;
  }
  
  const content = readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Vérifier s'il y a des console statements
  const hasConsole = /console\.(log|error|warn|info|debug)/.test(content);
  if (!hasConsole) return false;
  
  let updatedContent = content;
  let needsLoggerImport = false;
  
  // Remplacer tous les console statements
  for (const [oldPattern, newPattern] of Object.entries(CONSOLE_REPLACEMENTS)) {
    const regex = new RegExp(oldPattern.replace('.', '\\.'), 'g');
    if (regex.test(updatedContent)) {
      updatedContent = updatedContent.replace(regex, newPattern);
      needsLoggerImport = true;
    }
  }
  
  // Ajouter l'import logger si nécessaire
  if (needsLoggerImport && !updatedContent.includes('from "@/utils/logger"')) {
    // Trouver la position d'insertion pour l'import
    const importLines = updatedContent.split('\n').filter(line => line.trim().startsWith('import'));
    if (importLines.length > 0) {
      const lastImportIndex = updatedContent.lastIndexOf(importLines[importLines.length - 1]);
      const nextLineIndex = updatedContent.indexOf('\n', lastImportIndex) + 1;
      
      updatedContent = updatedContent.slice(0, nextLineIndex) + 
                      'import { logger } from "@/utils/logger";\n' + 
                      updatedContent.slice(nextLineIndex);
    }
  }
  
  // Écrire le fichier seulement s'il y a des changements
  if (updatedContent !== originalContent) {
    writeFileSync(filePath, updatedContent);
    const consoleMatches = (originalContent.match(/console\.(log|error|warn|info|debug)/g) || []).length;
    console.log(`✅ Cleaned ${fileName}: ${consoleMatches} console statements replaced`);
    return true;
  }
  
  return false;
}

function main() {
  console.log('🚀 Starting Emergency Console.log Cleanup - Phase 3');
  console.log('================================================\n');
  
  const allFiles = getAllTsxFiles(SRC_DIR);
  let processedCount = 0;
  let totalConsoleCount = 0;
  
  for (const file of allFiles) {
    const fileContent = readFileSync(file, 'utf8');
    const consoleCount = (fileContent.match(/console\.(log|error|warn|info|debug)/g) || []).length;
    
    if (consoleCount > 0) {
      totalConsoleCount += consoleCount;
      if (cleanConsoleInFile(file)) {
        processedCount++;
      }
    }
  }
  
  console.log(`\n📊 CLEANUP SUMMARY:`);
  console.log(`   • Files processed: ${processedCount}`);
  console.log(`   • Total console statements cleaned: ${totalConsoleCount}`);
  console.log(`   • Remaining files: ${allFiles.filter(f => {
    const content = readFileSync(f, 'utf8');
    return /console\.(log|error|warn|info|debug)/.test(content);
  }).length}`);
  
  console.log('\n✅ Phase 3 - Console cleanup COMPLETED!');
}

main();