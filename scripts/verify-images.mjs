import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const manifestPath = path.join(projectRoot, 'src', 'generated', 'image-manifest.json');
const sourceRoots = [
  path.join(projectRoot, 'src'),
  path.join(projectRoot, 'public'),
];

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function hashFile(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function fail(messages) {
  for (const message of messages) console.error(`- ${message}`);
  process.exit(1);
}

if (!fs.existsSync(manifestPath)) {
  fail(['이미지 manifest가 없습니다. pnpm images:build를 실행하세요.']);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const errors = [];

for (const [url, record] of Object.entries(manifest.images || {})) {
  const sourcePath = path.join(projectRoot, record.source);
  const outputPath = path.join(projectRoot, 'public', url.replace(/^\//, ''));
  if (!fs.existsSync(sourcePath)) {
    errors.push(`원본 누락: ${record.source}`);
  } else if (hashFile(sourcePath) !== record.sha256) {
    errors.push(`원본 변경 후 재생성 필요: ${record.source}`);
  }
  if (!fs.existsSync(outputPath)) errors.push(`기본 WebP 누락: ${url}`);
  for (const width of record.variants || []) {
    const variant = outputPath.replace(/\.webp$/i, `.w${width}.webp`);
    if (!fs.existsSync(variant)) errors.push(`반응형 WebP 누락: ${variant}`);
  }
}

for (const root of sourceRoots) {
  for (const filePath of walk(root).filter(file => /\.(tsx?|mdx?|ya?ml|json)$/i.test(file))) {
    if (filePath === manifestPath) continue;
    const content = fs.readFileSync(filePath, 'utf8');
    const matches = content.match(/\/(?:contents|images)\/[^"'()\s]+\.(?:png|jpe?g)/gi) || [];
    for (const match of matches) errors.push(`레거시 래스터 참조: ${match} (${filePath})`);
  }
}

for (const filePath of walk(path.join(projectRoot, 'public'))) {
  if (/\.(png|jpe?g)$/i.test(filePath) && path.basename(filePath) !== 'og.png') {
    errors.push(`public에 원본 래스터가 남아 있습니다: ${filePath}`);
  }
}

if (errors.length > 0) fail(errors);
console.log(`Image verification passed (${Object.keys(manifest.images || {}).length} images).`);
