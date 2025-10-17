import Link from 'next/link';
import { PostWithCategory } from '@/lib/post';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import clsx from 'clsx';

interface SeriesTableOfContentsProps {
  currentPostSlug: string;
  seriesPosts: PostWithCategory[];
  seriesName: string;
}

export function SeriesTableOfContents({
  currentPostSlug,
  seriesPosts,
  seriesName,
}: SeriesTableOfContentsProps) {
  if (seriesPosts.length <= 1) {
    return null;
  }

  const currentIndex = seriesPosts.findIndex(p => p.slug === currentPostSlug);
  const currentNumber = currentIndex >= 0 ? currentIndex + 1 : undefined;

  return (
    <section className="border-border-inverse-black overflow-hidden border">
      {/* 상단 검은색 바: 시리즈 제목 */}
      <p className="bg-bg-primary text-text-inverse-white px-5 py-3 font-bold md:text-lg">
        {seriesName}
      </p>
      {/* 아코디언: 현재 회차 표시 */}
      <Accordion type="single" collapsible>
        <AccordionItem value="series-contents">
          <AccordionTrigger className="px-4">
            <div className="flex w-full items-center gap-3">
              {currentNumber && (
                <span
                  className="text-text-inverse-white bg-bg-primary flex h-5 w-fit min-w-5
                    items-center justify-center rounded-sm px-1 text-xs font-semibold md:text-sm"
                >
                  {currentNumber}
                </span>
              )}
              <p className="text-text-primary flex-1 truncate text-sm md:text-base">
                {seriesPosts[currentIndex]?.metadata.title}
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="mt-2 px-2">
            <ol className="list-inside list-decimal space-y-2 px-2">
              {seriesPosts.map((post, idx) => {
                const isActive = post.slug === currentPostSlug;
                return (
                  <li key={post.slug} className="flex items-start gap-3">
                    <Link
                      href={`/posts/${post.slug}`}
                      className="text-text-primary flex flex-1 gap-3 text-sm"
                    >
                      <span
                        className={clsx(
                          `text-text-disabled bg-bg-disabled flex h-5 w-fit min-w-5 items-center
                          justify-center rounded-sm px-1 text-xs font-semibold md:text-sm`,
                          isActive && 'text-text-inverse-white bg-bg-primary'
                        )}
                      >
                        {idx + 1}
                      </span>
                      <p
                        className={clsx(
                          'text-text-disabled text-sm md:text-base',
                          isActive && 'text-text-primary'
                        )}
                      >
                        {post.metadata.title}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
