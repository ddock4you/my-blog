# my-blog

[블로그 방문하기](https://my-blog-lake-ten.vercel.app)

## 개요

Next.js(App Router) 기반의 **MDX 블로그/시리즈 사이트**입니다. 로컬 파일(`src/contents`)을 읽어 포스트/시리즈/카테고리를 구성하고, RSS/사이트맵/OG 이미지까지 함께 제공합니다.

### 주요 기능

- **MDX 포스트 렌더링**: `src/contents/posts/**/index.mdx` 기반
- **카테고리**: `src/data/categories.yaml`로 이름/정렬 제어
- **시리즈**: `src/data/series/*.yaml`로 메타/목차 order 관리
- **검색**: 빌드 시 생성한 정적 검색 인덱스를 브라우저에서 조회
- **다크모드**: `localStorage(darkMode)` + 시스템 선호도
- **댓글**: Giscus(선택, env로 설정)
- **분석**: Vercel Analytics + Google Analytics/GTM(선택, env로 설정)
- **SEO**: 메타데이터, JSON-LD, 정적 RSS/사이트맵/OG 이미지
- **정적 배포**: 요청 시 Vercel Function/Edge Runtime/Image Optimization 없이 `out/` 제공

### 기술 스택

- **Framework**: Next.js 16(App Router), React 19
- **Styling**: Tailwind CSS v4
- **Content**: MDX, `remark-gfm`, `rehype-pretty-code`(Shiki)
- **UI**: Radix UI 일부 컴포넌트

## 시작하기

### 요구 사항

- **Node.js**: Next.js 16 요구사항을 만족하는 버전(권장: LTS)
- **pnpm**: `pnpm-lock.yaml` 사용

### 설치 & 실행

```bash
pnpm install
pnpm dev
```

브라우저에서 `http://localhost:3000`을 엽니다.

### 빌드/린트

```bash
pnpm build
pnpm start
pnpm lint
```

`pnpm build`는 원본 이미지를 WebP로 변환한 다음 완전 정적 사이트를 `out/`에 생성하고,
함수 산출물·이미지 최적화 URL·100MB 제한을 자동 검증합니다.
`pnpm start`는 생성된 `out/`을 로컬 정적 서버로 제공합니다.

## 환경변수

`.env.local`에 아래 값을 설정할 수 있습니다(선택 항목 포함).

```bash
# 사이트 절대 URL (SEO, RSS, sitemap, metadataBase 등에 사용)
NEXT_PUBLIC_SITE_URL=https://example.com

# Google Analytics/GTM (값이 있으면 로더가 GA+GTM을 함께 주입)
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_GTM_ID=

# Giscus (댓글)
NEXT_PUBLIC_GISCUS_REPO_NAME=
NEXT_PUBLIC_GISCUS_REPO_ID=
NEXT_PUBLIC_GISCUS_CATEGORY_ID=
```

## 콘텐츠 작성 가이드

### 포스트 추가

포스트는 **폴더명 = slug** 규칙으로 관리됩니다.

- 위치: `src/contents/posts/<slug>/index.mdx`
- **중요**: `slug`(폴더명)는 **전역 유일**해야 합니다. (중복이면 빌드/실행 시 에러)

MDX 파일은 frontmatter가 필수이며, 특히 `category`는 반드시 있어야 합니다.

```mdx
---
title: 예시 글 제목
publishedAt: 2026-02-03
summary: 한 줄 요약
category: nextjs
series: nextjsDocs
image: /contents/posts/<slug>/images/cover.webp
---

내용...
```

### 이미지 경로와 사전 압축

PNG/JPEG 원본은 배포되지 않는 `assets/images-original`에 `public`과 같은 상대 경로로
저장합니다.

- 원본: `assets/images-original/contents/posts/a-post/images/pic.png`
- MDX 참조: `/contents/posts/a-post/images/pic.webp`

다음 명령은 기본 WebP와 160~768px 반응형 변형, manifest, 정적 OG 이미지를 생성·검증합니다.

```bash
pnpm images:build
pnpm images:verify
```

`pnpm dev`와 `pnpm build`에서도 이미지 생성이 먼저 실행됩니다.

## 시리즈/카테고리 데이터

### 카테고리 레지스트리

- 파일: `src/data/categories.yaml`
- 역할: 카테고리 슬러그 → 표시 이름/정렬(order)

### 시리즈 레지스트리

- 폴더: `src/data/series/*.yaml`
- 주요 필드: `title`, `description`, `inSeries`, `order`, `aliases`, `coverImage`
- **중요**: 시리즈 상세/정적 데이터에서 정렬을 위해 `order`가 사용됩니다.

## 제공 엔드포인트

### 페이지

- `/` 홈(카테고리 필터 + 페이지네이션)
- `/posts/[slug]` 포스트 상세(시리즈 목차/이전-다음/댓글)
- `/series` 시리즈 목록
- `/series/[slug]` 시리즈 상세
- `/about` 소개

### 정적 데이터

- `/data/posts.json`: 전체 포스트 요약
- `/data/series.json`: 전체 시리즈
- `/data/series/[slug]`: 시리즈별 전체 포스트
- `/data/search-index.json`: 검색 인덱스

카테고리 필터와 `page`/`mode` 페이지네이션은 브라우저에서 정적 컬렉션을 대상으로
처리합니다.

### SEO/Feed

- `/feed.xml` 전체 RSS
- `/series/[slug]/feed.xml` 시리즈 RSS
- `/sitemap.xml` 사이트맵
- `/robots.txt` 로봇 규칙
- `/og.png` OG/Twitter 공용 이미지

## 배포

Vercel 배포 환경에서는 `NEXT_PUBLIC_SITE_URL`을 실제 도메인으로 설정하세요. 배포물은
정적 파일로만 구성되며 Vercel Web Analytics는 유지됩니다.
