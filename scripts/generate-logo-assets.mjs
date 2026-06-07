/**
 * One-off asset generator: trims white edge padding from the source logo
 * and writes Expo / Android icon files into ./assets.
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ASSETS = path.join(ROOT, 'assets');

const SOURCE = path.join(ASSETS, 'source-logo.png');

const BRAND_BLUE = { r: 37, g: 99, b: 235, alpha: 1 };

async function getTrimBox(src) {
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * channels;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      const isEdgeWhite = a > 8 && r > 245 && g > 245 && b > 245;
      if (a > 8 && !isEdgeWhite) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  return {
    left: minX,
    top: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

async function writePng(bufferPromise, outPath, size) {
  await bufferPromise
    .clone()
    .resize(size, size, { fit: 'contain', background: BRAND_BLUE })
    .png()
    .toFile(outPath);
}

async function main() {
  await mkdir(ASSETS, { recursive: true });

  const trim = await getTrimBox(SOURCE);
  const trimmed = sharp(SOURCE).extract(trim);

  await writePng(trimmed, path.join(ASSETS, 'icon.png'), 1024);
  await writePng(trimmed, path.join(ASSETS, 'logo.png'), 512);
  await writePng(trimmed, path.join(ASSETS, 'android-icon-foreground.png'), 1024);
  await writePng(trimmed, path.join(ASSETS, 'splash-icon.png'), 512);

  await sharp({
    create: {
      width: 1024,
      height: 1024,
      channels: 4,
      background: BRAND_BLUE,
    },
  })
    .png()
    .toFile(path.join(ASSETS, 'android-icon-background.png'));

  await trimmed
    .clone()
    .resize(1024, 1024, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .grayscale()
    .threshold(40)
    .negate()
    .png()
    .toFile(path.join(ASSETS, 'android-icon-monochrome.png'));

  await writePng(trimmed, path.join(ASSETS, 'favicon.png'), 48);

  console.log('Logo assets generated in assets/');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
