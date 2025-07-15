import Link from "next/link";
import { Github, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* 좌측: 블로그 정보 */}
          <div className="text-center md:text-left">
            <p className="text-gray-600 dark:text-gray-400 text-sm">© 2025 My Blog.</p>
            <p className="text-gray-500 dark:text-gray-500 text-xs mt-1 flex items-center justify-center md:justify-start gap-1">
              Made with <Heart className="h-3 w-3 text-red-500" /> using Next.js
            </p>
          </div>

          {/* 우측: 소셜 링크 */}
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              aria-label="GitHub 프로필 보기"
            >
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline">GitHub</span>
            </Link>
          </div>
        </div>

        {/* 하단: 추가 링크들 */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-500">
            <Link
              href="/about"
              className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              About
            </Link>
            <span>•</span>
            <Link
              href="/posts"
              className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              All Posts
            </Link>
            <span>•</span>
            <Link
              href="/sitemap.xml"
              className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
