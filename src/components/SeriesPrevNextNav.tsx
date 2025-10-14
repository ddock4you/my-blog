import Link from 'next/link';
import { PostWithCategory } from '@/lib/post';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight } from 'lucide-react';

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
    <nav
      aria-label="시리즈 내 이전/다음 글"
      className="mt-12 border-t border-gray-200 pt-6 dark:border-gray-700"
    >
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">시리즈: {seriesName}</div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {prevPost && (
          <Link href={`/posts/${prevPost.slug}`} className="no-underline">
            <Card className="group hover:border-primary/40 h-full border transition-colors">
              <CardContent className="p-4">
                <div
                  className="text-muted-foreground group-hover:text-primary mb-1 flex items-center
                    gap-2 text-xs font-medium tracking-wide uppercase"
                >
                  <ArrowLeft className="size-4" />
                  이전 글
                </div>
                <div
                  className="text-foreground group-hover:text-primary line-clamp-2 text-base
                    font-semibold"
                >
                  {prevPost.metadata.title}
                </div>
              </CardContent>
            </Card>
          </Link>
        )}

        {nextPost && (
          <Link href={`/posts/${nextPost.slug}`} className="no-underline">
            <Card className="group hover:border-primary/40 h-full border transition-colors">
              <CardContent className="p-4">
                <div
                  className="text-muted-foreground group-hover:text-primary mb-1 flex items-center
                    justify-end gap-2 text-right text-xs font-medium tracking-wide uppercase
                    md:justify-end"
                >
                  다음 글
                  <ArrowRight className="size-4" />
                </div>
                <div
                  className="text-foreground group-hover:text-primary line-clamp-2 text-right
                    text-base font-semibold"
                >
                  {nextPost.metadata.title}
                </div>
              </CardContent>
            </Card>
          </Link>
        )}
      </div>
    </nav>
  );
}
