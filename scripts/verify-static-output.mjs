import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const outputRoot = path.join(projectRoot, 'out');
const sourceRoot = path.join(projectRoot, 'src');
const maxOutputBytes = 100 * 1024 * 1024;
const maxHomeBytes = 80 * 1024;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://my-blog-lake-ten.vercel.app';
// Next.js client chunks contain the framework's default loader implementation even when it is
// unused. Inspect emitted pages/data, where an actual optimizer request would be serialized.
const optimizerReferenceExtensions = new Set(['.html', '.json', '.xml', '.txt']);

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function fail(messages) {
  for (const message of messages) console.error(`- ${message}`);
  process.exit(1);
}

if (!fs.existsSync(outputRoot)) {
  fail(['정적 export 디렉터리 out/이 없습니다.']);
}

const errors = [];
const outputFiles = walk(outputRoot);
const outputBytes = outputFiles.reduce((sum, file) => sum + fs.statSync(file).size, 0);

if (outputBytes > maxOutputBytes) {
  errors.push(`정적 배포물 크기가 100MB를 초과합니다: ${(outputBytes / 1024 / 1024).toFixed(2)}MB`);
}

for (const filePath of walk(sourceRoot).filter(file => /\.(ts|tsx|js|jsx)$/i.test(file))) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (/runtime\s*=\s*['"]edge['"]/.test(content)) {
    errors.push(`Edge Runtime 선언 발견: ${filePath}`);
  }
}

for (const filePath of outputFiles) {
  if (filePath.includes('.func')) errors.push(`함수 산출물 발견: ${filePath}`);
  if (optimizerReferenceExtensions.has(path.extname(filePath))) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('/_next/image')) errors.push(`Vercel 이미지 최적화 URL 발견: ${filePath}`);
  }
  if (/\.(png|jpe?g)$/i.test(filePath) && path.basename(filePath) !== 'og.png') {
    errors.push(`압축되지 않은 래스터가 배포물에 포함됨: ${filePath}`);
  }
}

const requiredOutputs = [
  path.join(outputRoot, 'index.html'),
  path.join(outputRoot, 'og.png'),
  path.join(outputRoot, 'feed.xml'),
];
for (const required of requiredOutputs) {
  if (!fs.existsSync(required)) errors.push(`필수 정적 산출물 누락: ${required}`);
}

const rssFiles = outputFiles.filter(file => file.endsWith('feed.xml'));
for (const rssFile of rssFiles) {
  const xml = fs.readFileSync(rssFile, 'utf8');
  if (!xml.includes('<rss') || !xml.includes('</rss>')) {
    errors.push(`유효하지 않은 RSS XML: ${rssFile}`);
  }
  if (!xml.includes(siteUrl) || xml.includes('http://localhost')) {
    errors.push(`RSS 절대 URL이 배포 도메인과 일치하지 않음: ${rssFile}`);
  }
}

const homePath = path.join(outputRoot, 'index.html');
if (fs.existsSync(homePath)) {
  const homeHtml = fs.readFileSync(homePath, 'utf8');
  const homeBytes = Buffer.byteLength(homeHtml);
  const imageTags = homeHtml.match(/<img\b[^>]*>/g) || [];
  if (homeBytes > maxHomeBytes) {
    errors.push(`홈 HTML이 80KB를 초과합니다: ${(homeBytes / 1024).toFixed(1)}KB`);
  }
  if (imageTags.length !== 10) {
    errors.push(`홈 초기 이미지가 10개가 아닙니다: ${imageTags.length}`);
  }
  if (imageTags.some(tag => !tag.includes('.webp') && !tag.includes('.svg'))) {
    errors.push('홈 초기 이미지 중 WebP/SVG가 아닌 파일이 있습니다.');
  }
  if (imageTags.some(tag => tag.includes('.webp') && !tag.includes('srcSet='))) {
    errors.push('홈 WebP 이미지 중 정적 반응형 srcSet이 없는 항목이 있습니다.');
  }
}

if (errors.length > 0) fail(errors);
console.log(
  `Static output verification passed (${outputFiles.length} files, ${(outputBytes / 1024 / 1024).toFixed(2)}MB).`
);
