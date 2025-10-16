import Link from 'next/link';
import { PostWithCategory } from '@/lib/post';

type SeriesPrevNextNavProps = {
  currentPostSlug: string;
  seriesPosts: PostWithCategory[];
  seriesName: string;
};

export default function SeriesPrevNextNav({
  currentPostSlug,
  seriesPosts,
  seriesName,
}: SeriesPrevNextNavProps) {
  if (!seriesPosts || seriesPosts.length <= 1) return null;

  const currentIndex = seriesPosts.findIndex(p => p.slug === currentPostSlug);
  if (currentIndex === -1) return null;

  const prevPost = currentIndex > 0 ? seriesPosts[currentIndex - 1] : undefined;
  const nextPost =
    currentIndex < seriesPosts.length - 1 ? seriesPosts[currentIndex + 1] : undefined;

  if (!prevPost && !nextPost) return null;

  return (
    <nav aria-label="시리즈 내 이전/다음 글">
      <p className="bg-bg-primary text-text-inverse-white px-5 py-3 font-bold">{seriesName}</p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {prevPost && (
          <SeriesNavItem post={prevPost} variant="prev" seriesNumber={currentIndex + 1} />
        )}

        {nextPost && (
          <SeriesNavItem post={nextPost} variant="next" seriesNumber={currentIndex + 1} />
        )}
      </div>
    </nav>
  );
}

type SeriesNavItemProps = {
  post: PostWithCategory;
  variant: 'prev' | 'next';
  seriesNumber: number;
};

function SeriesNavItem({ post, variant, seriesNumber }: SeriesNavItemProps) {
  const isNext = variant === 'next';
  const index = isNext ? seriesNumber + 1 : seriesNumber - 1;
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="border-border-primary flex flex-col gap-3 border px-5 py-3 no-underline"
    >
      <div className="text-text-primary flex items-center gap-2 text-sm">
        {!isNext && (
          <span
            aria-hidden
            className="inline-block h-0 w-0 border-y-[4px] border-r-[8px] border-y-transparent
              [border-right-color:currentColor]"
          />
        )}
        <span>{isNext ? '다음 포스팅' : '이전 포스팅'}</span>
        {isNext && (
          <span
            aria-hidden
            className="inline-block h-0 w-0 border-y-[4px] border-l-[8px] border-y-transparent
              [border-left-color:currentColor]"
          />
        )}
      </div>
      <p className="flex gap-3">
        <span
          className="text-text-inverse-white bg-bg-primary flex h-5 w-fit min-w-5 items-center
            justify-center px-1 text-xs font-semibold"
        >
          {index}
        </span>
        <span className="text-text-primary truncate text-sm font-semibold">
          {post.metadata.title}
        </span>
      </p>
    </Link>
  );
}
