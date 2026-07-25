import Image, { type ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

export type MdxImageProps = Omit<
  ImageProps,
  'src' | 'alt' | 'width' | 'height' | 'fill' | 'loading' | 'decoding'
> & {
  src: string;
  alt: string;
  width: number | `${number}`;
  height: number | `${number}`;
  sizes?: string;
};

export function MdxImage({
  src,
  alt,
  width,
  height,
  sizes = '(max-width: 768px) calc(100vw - 3.5rem), 704px',
  className,
  ...props
}: MdxImageProps) {
  if (!alt || !width || !height) {
    throw new Error(
      `MDX 이미지에는 alt, width, height가 필요합니다: ${src} ` +
        `(alt=${String(alt)}, width=${String(width)}, height=${String(height)})`
    );
  }

  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      loading="lazy"
      decoding="async"
      className={cn('h-auto max-w-full rounded-lg', className)}
    />
  );
}
