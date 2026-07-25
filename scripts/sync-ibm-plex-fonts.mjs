import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packageRoot = path.join(projectRoot, 'node_modules', '@ibm', 'plex-sans-kr');
const packageCssPath = path.join(packageRoot, 'css', 'ibm-plex-sans-kr-all.css');
const packageFontPath = path.join(packageRoot, 'fonts', 'split', 'woff2', 'hinted');
const outputFontPath = path.join(projectRoot, 'public', 'fonts', 'ibm-plex-sans-kr');
const criticalCssPath = path.join(projectRoot, 'src', 'app', 'ibm-plex-sans-kr-critical.css');
const deferredCssPath = path.join(outputFontPath, 'ibm-plex-sans-kr.css');

if (!fs.existsSync(packageCssPath)) {
  throw new Error('@ibm/plex-sans-kr 패키지를 먼저 설치해주세요.');
}

const sourceCss = fs.readFileSync(packageCssPath, 'utf8');
const faces = sourceCss.match(/@font-face\s*\{[\s\S]*?\}/g) ?? [];

function splitFaces(weight, filePrefix) {
  return faces
    .filter(
      block =>
        block.includes(`font-weight: ${weight};`) && block.includes(`/IBMPlexSansKR-${filePrefix}-`)
    )
    .map(block =>
      block
        .replace(
          /src:[\s\S]*?url\("\.\.\/fonts\/split\/woff2\/hinted\/([^"]+)"\) format\("woff2"\);/,
          (_, filename) =>
            `font-display: optional;\n  src: url("/fonts/ibm-plex-sans-kr/${filename}") format("woff2");`
        )
        .replaceAll('"', "'")
    );
}

const regularFaces = splitFaces(400, 'Regular');
const semiboldFaces = splitFaces(600, 'SemiBold');
const logoSource = faces.find(
  block => block.includes('font-weight: 700;') && block.includes('IBMPlexSansKR-Bold-92.woff2')
);

if (regularFaces.length === 0 || semiboldFaces.length === 0 || !logoSource) {
  throw new Error('IBM Plex Sans KR split 폰트 선언을 찾지 못했습니다.');
}

const logoRange = logoSource.match(/unicode-range:\s*([^;]+);/)?.[1];
if (!logoRange) throw new Error('로고용 Latin subset 범위를 찾지 못했습니다.');

const logoFace = `@font-face {
  font-family: 'IBM Plex Sans KR Logo';
  font-style: normal;
  font-weight: 700;
  font-display: optional;
  src: url('/fonts/ibm-plex-sans-kr/IBMPlexSansKR-Bold-92.woff2') format('woff2');
  unicode-range: ${logoRange};
}`;

const isCommonSubset = block => block.includes('-92.woff2');
const criticalCss = `/* Generated critical subsets from the official @ibm/plex-sans-kr package. */
${regularFaces.filter(isCommonSubset).join('\n')}
${semiboldFaces.filter(isCommonSubset).join('\n')}
${logoFace}
`;
const deferredCss = `/* Generated deferred subsets from the official @ibm/plex-sans-kr package. */
${regularFaces.filter(block => !isCommonSubset(block)).join('\n')}
${semiboldFaces.filter(block => !isCommonSubset(block)).join('\n')}
`;

fs.mkdirSync(outputFontPath, { recursive: true });
for (const entry of fs.readdirSync(outputFontPath)) {
  fs.rmSync(path.join(outputFontPath, entry));
}

const filenames = new Set([
  ...regularFaces.flatMap(block => block.match(/IBMPlexSansKR-[^')]+\.woff2/g) ?? []),
  ...semiboldFaces.flatMap(block => block.match(/IBMPlexSansKR-[^')]+\.woff2/g) ?? []),
  'IBMPlexSansKR-Bold-92.woff2',
]);

for (const filename of filenames) {
  fs.copyFileSync(path.join(packageFontPath, filename), path.join(outputFontPath, filename));
}

fs.writeFileSync(criticalCssPath, criticalCss);
fs.writeFileSync(deferredCssPath, deferredCss);
console.log(
  `Synced ${filenames.size} split WOFF2 files (${regularFaces.length} regular, ${semiboldFaces.length} semibold).`
);
