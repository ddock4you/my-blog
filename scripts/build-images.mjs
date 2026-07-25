import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const projectRoot = process.cwd();
const sourceRoot = path.join(projectRoot, 'assets', 'images-original');
const publicRoot = path.join(projectRoot, 'public');
const manifestPath = path.join(projectRoot, 'src', 'generated', 'image-manifest.json');
const ogSourcePath = path.join(projectRoot, 'assets', 'og.svg');
const widths = [160, 240, 320, 360, 480, 640, 768];
const webpOptions = { quality: 82, effort: 6 };

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function toPosix(value) {
  return value.split(path.sep).join('/');
}

function publicUrl(relativePath) {
  return `/${toPosix(relativePath)}`;
}

function outputRelativePath(sourcePath) {
  const relative = path.relative(sourceRoot, sourcePath);
  return relative.replace(/\.(png|jpe?g)$/i, '.webp');
}

function variantPath(basePath, width) {
  return basePath.replace(/\.webp$/i, `.w${width}.webp`);
}

function hashFile(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function isWithin(parent, candidate) {
  const relative = path.relative(parent, candidate);
  return relative !== '' && !relative.startsWith('..') && !path.isAbsolute(relative);
}

function removePreviousGeneratedFiles() {
  if (!fs.existsSync(manifestPath)) return;
  const previous = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  for (const relativePath of previous.generatedFiles || []) {
    const target = path.resolve(projectRoot, relativePath);
    if (isWithin(publicRoot, target) && fs.existsSync(target)) {
      fs.rmSync(target);
    }
  }
}

function isCurrent(sourceFiles) {
  if (!fs.existsSync(manifestPath)) return false;
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const records = Object.values(manifest.images || {});
  if (records.length !== sourceFiles.length || manifest.ogSha256 !== hashFile(ogSourcePath)) {
    return false;
  }

  const recordsBySource = new Map(records.map(record => [record.source, record]));
  for (const sourcePath of sourceFiles) {
    const relativeSource = toPosix(path.relative(projectRoot, sourcePath));
    const record = recordsBySource.get(relativeSource);
    if (!record || record.sha256 !== hashFile(sourcePath)) return false;
  }

  return (manifest.generatedFiles || []).every(relativePath =>
    fs.existsSync(path.join(projectRoot, relativePath))
  );
}

async function buildRasterImage(sourcePath, manifest) {
  const relativeOutput = outputRelativePath(sourcePath);
  const outputPath = path.join(publicRoot, relativeOutput);
  const metadata = await sharp(sourcePath).metadata();
  const sourceWidth = metadata.width;

  if (!sourceWidth) {
    throw new Error(`이미지 너비를 확인할 수 없습니다: ${sourcePath}`);
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  await sharp(sourcePath).rotate().webp(webpOptions).toFile(outputPath);

  const generatedVariants = [];
  for (const width of widths.filter(value => value < sourceWidth)) {
    const target = variantPath(outputPath, width);
    await sharp(sourcePath)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp(webpOptions)
      .toFile(target);
    generatedVariants.push(width);
    manifest.generatedFiles.push(toPosix(path.relative(projectRoot, target)));
  }

  const url = publicUrl(relativeOutput);
  manifest.images[url] = {
    source: toPosix(path.relative(projectRoot, sourcePath)),
    sha256: hashFile(sourcePath),
    width: sourceWidth,
    variants: generatedVariants,
  };
  manifest.generatedFiles.push(toPosix(path.relative(projectRoot, outputPath)));
}

async function buildOgImage(manifest) {
  const outputPath = path.join(publicRoot, 'og.png');
  await sharp(ogSourcePath).png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(outputPath);
  manifest.generatedFiles.push(toPosix(path.relative(projectRoot, outputPath)));
}

async function main() {
  const sourceFiles = walk(sourceRoot).filter(file => /\.(png|jpe?g)$/i.test(file));
  if (sourceFiles.length === 0) {
    throw new Error(`원본 이미지가 없습니다: ${sourceRoot}`);
  }

  if (isCurrent(sourceFiles)) {
    console.log(`Images are current (${sourceFiles.length} source images).`);
    return;
  }

  removePreviousGeneratedFiles();

  const manifest = {
    version: 1,
    ogSha256: hashFile(ogSourcePath),
    images: {},
    generatedFiles: [],
  };

  for (const sourcePath of sourceFiles.sort()) {
    await buildRasterImage(sourcePath, manifest);
  }
  await buildOgImage(manifest);

  manifest.generatedFiles.sort();
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(
    `Generated ${Object.keys(manifest.images).length} WebP images and ${manifest.generatedFiles.length} files.`
  );
}

await main();
