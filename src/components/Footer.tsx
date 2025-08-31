import Link from "next/link";
import { Github, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-accent/50 border-t">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* 좌측: 블로그 정보 */}
          <div className="text-center md:text-left">
            <p className="text-muted-foreground text-sm">© 2025 My Blog.</p>
            <p className="text-muted-foreground text-xs mt-1 flex items-center justify-center md:justify-start gap-1">
              Made with <Heart className="h-3 w-3 text-red-500" /> using Next.js
            </p>
          </div>

          {/* 우측: 소셜 링크 */}
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub 프로필 보기"
              >
                <Github className="h-4 w-4" />
                <span className="hidden sm:inline">GitHub</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* 하단: 추가 링크들 */}
        <div className="mt-6 pt-6 border-t">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
            <Link
              href="/about"
              className="hover:text-foreground transition-colors"
            >
              About
            </Link>
            <span>•</span>
            <Link
              href="/posts"
              className="hover:text-foreground transition-colors"
            >
              All Posts
            </Link>
            <span>•</span>
            <Link
              href="/sitemap.xml"
              className="hover:text-foreground transition-colors"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
