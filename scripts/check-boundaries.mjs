import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const files = new Map();
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (['node_modules', '.next'].includes(entry.name)) continue;
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(file);
    else if (/\.(ts|tsx)$/.test(file)) files.set(file, await readFile(file, 'utf8'));
  }
}
await walk(path.join(root, 'apps/web/src')); await walk(path.join(root, 'packages/shared/src'));
const errors = [];
for (const [file, source] of files) {
  const relative = path.relative(root, file).replaceAll('\\', '/');
  if (/\bfetch\s*\(/.test(source) && !relative.includes('/api/http.ts')) errors.push(relative + ': raw fetch outside API boundary');
  if (/process\.env/.test(source) && !relative.includes('/config/')) errors.push(relative + ': environment read outside config');
  if (/from ['"]phaser['"]/.test(source) && !relative.endsWith('/game/runtime.ts')) errors.push(relative + ': Phaser import outside browser runtime');
  if (relative.startsWith('packages/shared/') && /from ['"](?:react|next|phaser)(?:['"/])/.test(source)) errors.push(relative + ': framework import in shared');
  if (/@ts-ignore|@ts-nocheck|eslint-disable/.test(source)) errors.push(relative + ': unexplained suppression');
}
function importsOf(file) {
  return [...files.get(file).matchAll(/(?:from\s*|import\s*\(\s*|import\s*)['"]((?:\.|@\/)[^'"]+)['"]/g)].flatMap(match => {
    const base = match[1].startsWith('@/') ? path.resolve(root, 'apps/web/src', match[1].slice(2)) : path.resolve(path.dirname(file), match[1]);
    return [base, base + '.ts', base + '.tsx', path.join(base, 'index.ts'), path.join(base, 'index.tsx')].filter(candidate => files.has(candidate));
  });
}
function checkClient(file, origin, seen = new Set()) {
  if (seen.has(file)) return; seen.add(file);
  if (file.endsWith('.server.ts')) errors.push(path.relative(root, origin) + ': imports server-only module ' + path.relative(root, file));
  for (const child of importsOf(file)) checkClient(child, origin, seen);
}
for (const [file, source] of files) if (/^['"]use client['"];/.test(source)) checkClient(file, file);
for (const name of ['package.json', 'apps/web/package.json', 'packages/shared/package.json']) {
  const manifest = JSON.parse(await readFile(path.join(root, name), 'utf8'));
  for (const [dependency, version] of Object.entries({ ...manifest.dependencies, ...manifest.devDependencies })) {
    if (!/^(?:workspace:)?\d+\.\d+\.\d+$/.test(version)) errors.push(name + ': non-exact dependency ' + dependency);
    if (dependency.startsWith('@goodsdks/') || dependency.startsWith('@gooddollar/')) errors.push(name + ': gated GoodDollar dependency');
  }
}
if (errors.length) throw new Error(errors.join('\n'));
console.log('Architecture checks passed: ' + files.size + ' TypeScript source files and exact manifests.');
