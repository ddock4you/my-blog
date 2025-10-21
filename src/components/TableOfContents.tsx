// 현재는 사용하지 않는 컴포넌트
'use client';

import { useEffect, useState } from 'react';
import { cn, slugify } from '@/lib/utils';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 헤딩 요소들 추출
    const headings = document.querySelectorAll('h1, h2, h3');

    // 각 헤딩에 고유 id를 보장 (없으면 생성, 중복이면 접미어 추가)
    const usedIds = new Set<string>();
    const tocItems: TocItem[] = Array.from(headings).map((heading, idx) => {
      const element = heading as HTMLElement;

      const baseText = (element.textContent || '').trim() || `section-${idx + 1}`;

      // 우선 기존 id 사용, 없거나 공백이면 텍스트 기반으로 생성
      const initialId = (element.id || '').trim();
      const candidateId = slugify(initialId || baseText) || `section-${idx + 1}`;

      // 중복 방지: 이미 존재하면 -2, -3 ... 접미어 추가
      let uniqueId = candidateId;
      let counter = 2;
      while (usedIds.has(uniqueId)) {
        uniqueId = `${candidateId}-${counter++}`;
      }
      usedIds.add(uniqueId);

      // DOM에도 반영하여 앵커 스크롤이 동작하도록 함
      element.id = uniqueId;

      return {
        id: uniqueId,
        text: baseText,
        level: parseInt(element.tagName.charAt(1)),
      };
    });

    setToc(tocItems);

    // IntersectionObserver로 현재 섹션 하이라이트
    const observer = new IntersectionObserver(
      entries => {
        const visibleHeadings = entries
          .filter(entry => entry.isIntersecting)
          .sort(
            (a, b) => (a.target as HTMLElement).offsetTop - (b.target as HTMLElement).offsetTop
          );

        if (visibleHeadings.length > 0) {
          const current = visibleHeadings[0].target as HTMLElement;
          setActiveId(current.id);
        } else {
          // 교차 중인 요소가 없으면, 가장 위에 가까운 헤딩을 선택
          const headingElements = Array.from(headings) as HTMLElement[];
          const scrollY = window.scrollY || 0;
          for (let i = headingElements.length - 1; i >= 0; i--) {
            const el = headingElements[i];
            if (el.offsetTop <= scrollY + 120) {
              setActiveId(el.id);
              break;
            }
          }
        }
      },
      {
        root: null,
        rootMargin: '0px 0px -70% 0px',
        threshold: [0, 1.0],
      }
    );

    headings.forEach(h => observer.observe(h));
    return () => observer.disconnect();
  }, []);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // 모바일에서 클릭 후 목차 닫기
      if (window.innerWidth < 1280) {
        setIsOpen(false);
      }
    }
  };

  if (toc.length === 0) return null;

  return (
    <>
      {/* 모바일 토글 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-4 bottom-4 z-50 rounded-full bg-blue-600 p-3 text-white shadow-lg
          transition-colors hover:bg-blue-700 xl:hidden"
        aria-label="목차 열기/닫기"
        title="목차 열기/닫기"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* 모바일 오버레이 */}
      {isOpen && (
        <div
          className="bg-opacity-50 fixed inset-0 z-40 bg-black xl:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 목차 컨텐츠 */}
      <aside
        className={cn(
          'xl:sticky xl:top-6 xl:block xl:h-fit xl:w-64',
          `fixed right-0 bottom-0 left-0 z-50 bg-white xl:bg-transparent dark:bg-gray-800
          xl:dark:bg-transparent`,
          'max-h-[70vh] overflow-y-auto xl:max-h-none',
          'transition-transform duration-300 ease-in-out',
          {
            'translate-y-0': isOpen,
            'translate-y-full xl:translate-y-0': !isOpen,
          }
        )}
      >
        <div
          className="rounded-t-lg border bg-white p-4 shadow-lg xl:rounded-lg xl:shadow-sm
            dark:bg-gray-800"
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">목차</h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="cursor-pointer text-gray-400 hover:text-gray-600 xl:hidden
                dark:text-gray-500 dark:hover:text-gray-300"
              aria-label="목차 닫기"
              title="목차 닫기"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <nav>
            <ul className="space-y-1 text-sm">
              {toc.map((item, idx) => (
                <li key={`${item.id || 'toc'}-${idx}`}>
                  <button
                    type="button"
                    onClick={() => handleClick(item.id)}
                    className={cn(
                      `block w-full cursor-pointer rounded px-3 py-2 text-left transition-colors
                      hover:bg-gray-100 dark:hover:bg-gray-700`,
                      {
                        [`border-l-2 border-blue-500 bg-blue-100 text-blue-900 dark:bg-blue-900
                        dark:text-blue-100`]: activeId === item.id,
                        'text-gray-600 dark:text-gray-400': activeId !== item.id,
                      }
                    )}
                    style={{
                      paddingLeft: `${(item.level - 1) * 12 + 12}px`,
                    }}
                  >
                    {item.text}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
