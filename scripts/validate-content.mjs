import fs from 'node:fs';
import path from 'node:path';

const postsRoot = path.join(process.cwd(), 'src', 'contents', 'posts');
const errors = [];

function findPostFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return findPostFiles(fullPath);
    return entry.name === 'index.mdx' ? [fullPath] : [];
  });
}

for (const postPath of findPostFiles(postsRoot)) {
  const relativePath = path.relative(process.cwd(), postPath);
  const source = fs.readFileSync(postPath, 'utf8');
  const contentOnly = source
    .replace(/^---[\s\S]*?---/, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`\n]*`/g, '');

  const headings = [...contentOnly.matchAll(/^##\s+(.+)$/gm)].map(match =>
    match[1].trim().replace(/\s+/g, ' ')
  );
  const seenHeadings = new Set();
  for (const heading of headings) {
    if (seenHeadings.has(heading)) {
      errors.push(`${relativePath}: 중복된 최상위 섹션 "${heading}"`);
    }
    seenHeadings.add(heading);
  }

  if (/<img\b/i.test(contentOnly)) {
    errors.push(`${relativePath}: 일반 <img> 대신 치수가 지정된 <Image>를 사용해야 합니다.`);
  }

  for (const imageMatch of contentOnly.matchAll(/<Image\b([\s\S]*?)\/>/g)) {
    const props = imageMatch[1];
    for (const requiredProp of ['src', 'alt', 'width', 'height']) {
      if (!new RegExp(`\\b${requiredProp}\\s*=`).test(props)) {
        errors.push(`${relativePath}: <Image>에 ${requiredProp} 속성이 필요합니다.`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Content validation passed.');
}
