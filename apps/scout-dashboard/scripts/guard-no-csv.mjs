import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const STRICT = process.env.NEXT_PUBLIC_STRICT_DATASOURCE === 'true';
if (!STRICT) {
  console.log('STRICT_DATASOURCE=false — CSV guard skipped');
  process.exit(0);
}

async function findFiles(dir, extensions = ['.ts', '.tsx', '.js', '.mjs', '.cjs']) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules') {
      files.push(...await findFiles(path, extensions));
    } else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
      files.push(path);
    }
  }
  return files;
}

const files = await findFiles('src');
const offenders = [];

for (const f of files) {
  const s = await readFile(f, 'utf8');
  if (
    s.includes('loadCsvDevOnly(') ||
    s.match(/\.csv['"]/) ||
    s.includes('papaparse') ||
    (s.includes('exportToCSV') && !s.includes('STRICT_DATASOURCE') && !s.includes('disabled in production'))
  ) {
    offenders.push(f);
  }
}

if (offenders.length) {
  console.error('❌ CSV references not allowed in production builds:');
  offenders.forEach((f) => console.error(' -', f));
  process.exit(1);
}
console.log('✅ CSV guard passed');