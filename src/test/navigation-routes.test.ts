import { describe, it, expect } from 'vitest';
import { ROUTES } from '@/config/routes';
import * as fs from 'fs';
import * as path from 'path';

// Recursively get all .tsx/.ts files in src/
function getSourceFiles(dir: string, files: string[] = []): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules' && entry.name !== 'test') {
      getSourceFiles(fullPath, files);
    } else if (entry.isFile() && /\.(tsx?|jsx?)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

describe('Navigation routes audit', () => {
  it('should have all ROUTES with a valid path', () => {
    for (const route of ROUTES) {
      expect(route.path).toBeTruthy();
      expect(route.path.startsWith('/')).toBe(true);
      expect(route.component).toBeTruthy();
    }
  });

  it('should not contain /api/placeholder references in source files', () => {
    const srcDir = path.resolve(__dirname, '..');
    const files = getSourceFiles(srcDir);
    const violations: string[] = [];

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      if (content.includes('/api/placeholder')) {
        violations.push(file.replace(srcDir, 'src'));
      }
    }

    expect(violations).toEqual([]);
  });

  it('should not contain links to /indicators/submit (removed route)', () => {
    const srcDir = path.resolve(__dirname, '..');
    const files = getSourceFiles(srcDir);
    const violations: string[] = [];

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      if (content.includes('/indicators/submit')) {
        violations.push(file.replace(srcDir, 'src'));
      }
    }

    expect(violations).toEqual([]);
  });
});
