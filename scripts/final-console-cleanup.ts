#!/usr/bin/env tsx
/**
 * ÉTAPE 1: ÉLIMINATION FINALE CONSOLE.LOG
 * Script automatisé pour éliminer les 39 instances restantes
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const SRC_DIR = './src';

const CONSOLE_REPLACEMENTS = {
  'console.error': 'logger.error',
  'console.warn': 'logger.warn', 
  'console.info': 'logger.info',
  'console.log': 'logger.debug',
  'console.debug': 'logger.debug'
};

// Fichiers déjà traités manuellement
const PROCESSED_FILES = new Set([
  'logger.ts',
  'loggerMigration.ts',
  'updateTranslationImports.ts'
]);

function getAllTsxFiles(dir: string): string[] {
  const files: string[] = [];
  const items = readdirSync(dir);
  
  for (const item of items) {
    if (item === 'node_modules') continue;
    
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...getAllTsxFiles(fullPath));
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function cleanConsoleInFile(filePath: string): boolean {
  const fileName = filePath.split('/').pop() || '';
  
  if (PROCESSED_FILES.has(fileName)) {
    console.log(`⏭️  Fichier déjà traité: ${filePath}`);
    return false;
  }

  const content = readFileSync(filePath, 'utf-8');
  let newContent = content;
  let hasChanges = false;
  
  // Remplacer les console statements
  Object.entries(CONSOLE_REPLACEMENTS).forEach(([oldPattern, newPattern]) => {
    const regex = new RegExp(`\\b${oldPattern.replace('.', '\\.')}\\b`, 'g');
    if (regex.test(newContent)) {
      newContent = newContent.replace(regex, newPattern);
      hasChanges = true;
    }
  });
  
  // Ajouter l'import logger si nécessaire
  if (hasChanges && !newContent.includes("from '@/utils/logger'")) {
    const importLine = "import { logger } from '@/utils/logger';\n";
    
    if (newContent.includes('import')) {
      newContent = newContent.replace(
        /(import.*from.*['"];?\n)/,
        `$1${importLine}`
      );
    } else {
      newContent = importLine + newContent;
    }
  }
  
  if (hasChanges) {
    writeFileSync(filePath, newContent);
    console.log(`✅ Nettoyé: ${filePath}`);
    return true;
  }
  
  return false;
}

function main() {
  console.log('🚀 ÉTAPE 1: ÉLIMINATION FINALE CONSOLE.LOG\n');
  
  const allFiles = getAllTsxFiles(SRC_DIR);
  let processedCount = 0;
  let totalConsoleStatements = 0;
  
  for (const file of allFiles) {
    const content = readFileSync(file, 'utf-8');
    const consoleMatches = content.match(/console\.(log|error|warn|info|debug)/g);
    
    if (consoleMatches) {
      totalConsoleStatements += consoleMatches.length;
      if (cleanConsoleInFile(file)) {
        processedCount++;
      }
    }
  }
  
  console.log(`\n📊 RÉSUMÉ:`);
  console.log(`   • Fichiers traités: ${processedCount}`);
  console.log(`   • Console statements nettoyés: ${totalConsoleStatements}`);
  console.log(`   • Status: ${totalConsoleStatements === 0 ? '✅ PARFAIT' : '⚠️ RESTANTS'}`);
}

main();