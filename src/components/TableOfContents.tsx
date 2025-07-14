"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 헤딩 요소들 추출
    const headings = document.querySelectorAll("h1, h2, h3");
    const tocItems: TocItem[] = Array.from(headings).map((heading) => ({
      id: heading.id,
      text: heading.textContent || "",
      level: parseInt(heading.tagName.charAt(1)),
    }));

    setToc(tocItems);

    // 스크롤 이벤트로 현재 섹션 하이라이트
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const headingElements = Array.from(headings);

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const element = headingElements[i] as HTMLElement;
        if (element.offsetTop <= scrollY + 100) {
          setActiveId(element.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
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
        className="xl:hidden fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="목차 열기/닫기"
        title="목차 열기/닫기"
      >
        <svg
          className="w-6 h-6"
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
          className="xl:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 목차 컨텐츠 */}
      <aside
        className={cn(
          "xl:block xl:w-64 xl:h-fit xl:sticky xl:top-6",
          "fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 xl:bg-transparent xl:dark:bg-transparent",
          "max-h-[70vh] xl:max-h-none overflow-y-auto",
          "transition-transform duration-300 ease-in-out",
          {
            "translate-y-0": isOpen,
            "translate-y-full xl:translate-y-0": !isOpen,
          }
        )}
      >
        <div className="border rounded-t-lg xl:rounded-lg p-4 bg-white dark:bg-gray-800 shadow-lg xl:shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm text-gray-600 dark:text-gray-400">목차</h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="xl:hidden text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 cursor-pointer"
              aria-label="목차 닫기"
              title="목차 닫기"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              {toc.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleClick(item.id)}
                    className={cn(
                      "block w-full text-left py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer",
                      {
                        "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 border-l-2 border-blue-500":
                          activeId === item.id,
                        "text-gray-600 dark:text-gray-400": activeId !== item.id,
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
