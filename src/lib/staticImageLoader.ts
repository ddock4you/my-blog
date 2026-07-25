import type { ImageLoaderProps } from 'next/image';
import imageManifest from '@/generated/image-manifest.json';

type ManifestRecord = {
  width: number;
  variants: number[];
};

const images = imageManifest.images as Record<string, ManifestRecord>;

export default function staticImageLoader({ src, width }: ImageLoaderProps) {
  if (
    src.startsWith('data:') ||
    src.startsWith('http://') ||
    src.startsWith('https://') ||
    src.endsWith('.svg')
  ) {
    return src;
  }

  const image = images[src];
  if (!image || width >= image.width) {
    return src;
  }

  const variantWidth = image.variants.find(candidate => candidate >= width);
  if (!variantWidth) {
    return src;
  }

  return src.replace(/\.webp$/i, `.w${variantWidth}.webp`);
}
