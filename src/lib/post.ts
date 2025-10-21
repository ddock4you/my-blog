import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import { calculateReadingTime, slugify } from './utils';
import { SERIES_REGISTRY, type SeriesMeta, findSeriesKey, getSeriesOrder } from './series';

// Category registry (YAML) loader
type CategoryRegistryItem = { slug: string; name: string; order?: number };
type CategoryRegistry = Record<string, { name: string; order?: number }>;

const CATEGORIES_FILE = path.join(process.cwd(), 'src', 'data', 'categories.yaml');

let cachedCategoryRegistry: CategoryRegistry | null = null;

function loadCategoriesRegistryFromDisk(): CategoryRegistry {
  try {
    const raw = fs.readFileSync(CATEGORIES_FILE, 'utf-8');
    const parsed = YAML.parse(raw) || {};
    const items: CategoryRegistryItem[] = Array.isArray(parsed.categories) ? parsed.categories : [];
    const map: CategoryRegistry = {};
    for (const item of items) {
      if (!item || !item.slug) continue;
      const slug = String(item.slug).trim();
      const name = String(item.name ?? slug).trim();
      const order = typeof item.order === 'number' ? item.order : undefined;
      map[slug] = { name, order };
    }
    return map;
  } catch {
    return {};
  }
}

function getCategoryRegistry(): CategoryRegistry {
  if (cachedCategoryRegistry) return cachedCategoryRegistry;
  cachedCategoryRegistry = loadCategoriesRegistryFromDisk();
  return cachedCategoryRegistry;
}

function resolveCategoryName(slug: string): string {
  const registry = getCategoryRegistry();
  return registry[slug]?.name ?? slug;
}

type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
  series?: string;
  category?: string; // frontmatter에서 읽기(필수). 폴더에서 유도하지 않음
};

export type PostWithCategory = {
  metadata: Metadata;
  slug: string;
  content: string;
  category: string; // slug
  categoryName: string; // korean name
  fullPath: string;
  series?: string;
  image?: string; // 게시글 이미지 경로
  readingTime: number; // 읽기 시간 (분)
};

export type CategoryInfo = {
  slug: string;
  name: string;
  count: number;
  description?: string;
};

// 시리즈 정보 타입
export type SeriesInfo = {
  name: string;
  slug: string;
  count: number;
  categories: string[]; // 카테고리 슬러그 목록
  categoryNames: string[]; // 카테고리 한글명 목록
  firstPostSlug: string; // 처음부터 읽기 링크용
  firstPublishedAt: string;
  lastPublishedAt: string;
  coverImage?: string;
  firstPostSummary?: string;
  meta?: SeriesMeta; // 레지스트리에서 가져온 메타 정보
};

function parseFrontmatter(fileContent: string, filePath: string) {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  const match = frontmatterRegex.exec(fileContent);

  // If no front matter is found, throw an explicit error
  if (!match || !match[1]) {
    throw new Error(
      `MDX 파일에 front matter가 누락되었습니다: ${filePath}. '---' 블록을 추가해주세요.`
    );
  }

  const frontMatterBlock = match[1];
  const content = fileContent.replace(frontmatterRegex, '').trim();
  const frontMatterLines = frontMatterBlock.trim().split('\n');
  const metadata: Partial<Metadata> = {};

  frontMatterLines.forEach(line => {
    const [key, ...valueArr] = line.split(': ');
    let value = valueArr.join(': ').trim();
    value = value.replace(/^['"](.*)['"]$/, '$1'); // Remove quotes
    metadata[key.trim() as keyof Metadata] = value;
  });

  return { metadata: metadata as Metadata, content };
}

function getAllMDXFiles(
  dir: string,
  basePath: string = ''
): Array<{
  file: string;
  relativePath: string;
}> {
  const files: Array<{
    file: string;
    relativePath: string;
  }> = [];

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const nestedFiles = getAllMDXFiles(fullPath, path.join(basePath, item));
      files.push(...nestedFiles);
    } else if (item === 'index.mdx') {
      files.push({
        file: fullPath,
        relativePath: basePath,
      });
    }
  }

  return files;
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, 'utf-8');
  return parseFrontmatter(rawContent, filePath);
}

export function getBlogPosts(): PostWithCategory[] {
  const contentsDir = path.join(process.cwd(), 'src', 'contents', 'posts');
  const allFiles = getAllMDXFiles(contentsDir);

  const posts = allFiles.map(({ file, relativePath }) => {
    const { metadata, content } = readMDXFile(file);
    const slug = path.basename(relativePath);
    const readingTime = calculateReadingTime(content);

    const category = String((metadata as any).category || '').trim();
    if (!category) {
      throw new Error(
        `MDX frontmatter에 category가 누락되었습니다: ${file}. 'category: <slug>'를 추가해주세요.`
      );
    }

    return {
      metadata,
      slug,
      content,
      category,
      categoryName: resolveCategoryName(category),
      fullPath: relativePath,
      series: metadata.series,
      image: metadata.image,
      readingTime,
    };
  });

  // 전역 slug 유일성 검증
  const seen = new Map<string, number>();
  for (const p of posts) {
    seen.set(p.slug, (seen.get(p.slug) || 0) + 1);
  }
  const duplicates = Array.from(seen.entries())
    .filter(([, count]) => count > 1)
    .map(([slug]) => slug);
  if (duplicates.length > 0) {
    throw new Error(
      `중복된 slug가 발견되었습니다: ${duplicates.join(', ')}. slug는 전역 유일해야 합니다.`
    );
  }

  return posts;
}

export function getPostsBySeries(category: string, series: string): PostWithCategory[] {
  const categoryPosts = getPostsByCategory(category);
  const filtered = categoryPosts.filter(
    post => (post.series || '').trim().toLowerCase() === (series || '').trim().toLowerCase()
  );

  // YAML order 우선 적용
  const key = findSeriesKey(series || '');
  const order = key ? getSeriesOrder(key) : [];

  if (order.length > 0) {
    const indexMap = new Map<string, number>();
    order.forEach((slug, idx) => indexMap.set(slug, idx));

    return [...filtered].sort((a, b) => {
      const ai = indexMap.has(a.slug) ? indexMap.get(a.slug)! : Number.POSITIVE_INFINITY;
      const bi = indexMap.has(b.slug) ? indexMap.get(b.slug)! : Number.POSITIVE_INFINITY;
      if (ai !== bi) return ai - bi;
      // 보조 정렬: 발행일, 그 다음 슬러그
      const ad = new Date(a.metadata.publishedAt).getTime();
      const bd = new Date(b.metadata.publishedAt).getTime();
      if (ad !== bd) return ad - bd;
      return a.slug.localeCompare(b.slug);
    });
  }

  // fallback: 발행일 오름차순, 그 다음 슬러그
  return filtered.sort((a, b) => {
    const ad = new Date(a.metadata.publishedAt).getTime();
    const bd = new Date(b.metadata.publishedAt).getTime();
    if (ad !== bd) return ad - bd;
    return a.slug.localeCompare(b.slug);
  });
}

// 카테고리와 무관하게 시리즈명으로 전체 포스트 조회 (대소문자 무시)
export function getPostsBySeriesName(seriesName: string): PostWithCategory[] {
  const allPosts = getBlogPosts();
  const target = (seriesName || '').trim().toLowerCase();
  return allPosts
    .filter(post => (post.series || '').trim().toLowerCase() === target)
    .sort(
      (a, b) =>
        new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
    );
}

export function getPostsByCategory(category: string): PostWithCategory[] {
  const allPosts = getBlogPosts();
  return allPosts.filter(post => post.category === category);
}

export function getAllCategories(): CategoryInfo[] {
  const allPosts = getBlogPosts();
  const countMap = new Map<string, number>();

  allPosts.forEach(post => {
    countMap.set(post.category, (countMap.get(post.category) || 0) + 1);
  });

  const registry = getCategoryRegistry();
  const result: CategoryInfo[] = Array.from(countMap.entries()).map(([slug, count]) => ({
    slug,
    name: registry[slug]?.name ?? slug,
    count,
  }));

  // order 우선 정렬, 이후 이름 오름차순
  result.sort((a, b) => {
    const ao = registry[a.slug]?.order;
    const bo = registry[b.slug]?.order;
    if (typeof ao === 'number' && typeof bo === 'number') return ao - bo;
    if (typeof ao === 'number') return -1;
    if (typeof bo === 'number') return 1;
    return a.name.localeCompare(b.name);
  });

  return result;
}

export function getPostBySlug(category: string, slug: string): PostWithCategory | undefined {
  const allPosts = getBlogPosts();
  return allPosts.find(post => post.category === category && post.slug === slug);
}

// 모든 시리즈 집계
export function getAllSeries(): SeriesInfo[] {
  const posts = getBlogPosts().filter(p => (p.series || '').trim() !== '');

  const seriesMap = new Map<string, PostWithCategory[]>();

  posts.forEach(post => {
    const seriesName = (post.series || '').trim();
    if (!seriesName) return;
    const arr = seriesMap.get(seriesName) || [];
    arr.push(post);
    seriesMap.set(seriesName, arr);
  });

  const seriesList: SeriesInfo[] = Array.from(seriesMap.entries()).map(([name, seriesPosts]) => {
    const sorted = [...seriesPosts].sort(
      (a, b) =>
        new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
    );

    const first = sorted[sorted.length - 1];
    const last = sorted[0];

    const categories = Array.from(new Set(sorted.map(p => p.category)));
    const categoryNames = Array.from(new Set(sorted.map(p => p.categoryName)));

    // 레지스트리 매칭(파일명/aliases/slug 동등)
    const registryKey = findSeriesKey(name);
    const meta = registryKey ? SERIES_REGISTRY[registryKey] : undefined;
    const slug = slugify(registryKey || name);

    return {
      name,
      slug,
      count: sorted.length,
      categories,
      categoryNames,
      firstPostSlug: first.slug,
      firstPublishedAt: first.metadata.publishedAt,
      lastPublishedAt: last.metadata.publishedAt,
      coverImage: meta?.coverImage || first.image || first.metadata.image,
      firstPostSummary: first.metadata.summary,
      meta,
    };
  });

  return seriesList.sort((a, b) => {
    const ad = new Date(a.lastPublishedAt).getTime();
    const bd = new Date(b.lastPublishedAt).getTime();
    return bd - ad; // 최신 시리즈 우선
  });
}

// 기존 함수와의 호환성을 위해 유지 (deprecated)
export function getBlogPostsLegacy() {
  return getBlogPosts().map(post => ({
    metadata: post.metadata,
    slug: post.slug,
    content: post.content,
  }));
}

// 검색용 데이터 타입
export interface SearchData {
  slug: string;
  category: string;
  categoryName: string;
  title: string;
  summary: string;
  publishedAt: string;
  image?: string;
}

// 검색 데이터 생성 함수
export function generateSearchData(): SearchData[] {
  const posts = getBlogPosts();

  const searchData = posts.map(post => ({
    slug: post.slug,
    category: post.category,
    categoryName: post.categoryName,
    title: post.metadata.title,
    summary: post.metadata.summary,
    publishedAt: post.metadata.publishedAt,
    image: post.image || post.metadata.image, // PostWithCategory의 image 필드 우선 사용
  }));

  // 발행일 기준으로 정렬 (최신순)
  return searchData.sort((a, b) => {
    if (new Date(b.publishedAt) > new Date(a.publishedAt)) {
      return -1;
    }
    return 1;
  });
}

// generateSearchDataFile 함수는 Context 방식으로 변경되면서 더 이상 사용되지 않음
// export function generateSearchDataFile(...) { ... }
