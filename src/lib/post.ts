import fs from "fs";
import path from "path";

type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
};

export type PostWithCategory = {
  metadata: Metadata;
  slug: string;
  content: string;
  category: string;
  fullPath: string;
};

export type CategoryInfo = {
  name: string;
  count: number;
  description?: string;
};

function parseFrontmatter(fileContent: string) {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  const match = frontmatterRegex.exec(fileContent);
  const frontMatterBlock = match![1];
  const content = fileContent.replace(frontmatterRegex, "").trim();
  const frontMatterLines = frontMatterBlock.trim().split("\n");
  const metadata: Partial<Metadata> = {};

  frontMatterLines.forEach((line) => {
    const [key, ...valueArr] = line.split(": ");
    let value = valueArr.join(": ").trim();
    value = value.replace(/^['"](.*)['"]$/, "$1"); // Remove quotes
    metadata[key.trim() as keyof Metadata] = value;
  });

  return { metadata: metadata as Metadata, content };
}

function getAllMDXFiles(
  dir: string,
  basePath: string = ""
): Array<{
  file: string;
  category: string;
  relativePath: string;
}> {
  const files: Array<{
    file: string;
    category: string;
    relativePath: string;
  }> = [];

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // 카테고리 폴더인 경우 재귀적으로 탐색
      const categoryFiles = getAllMDXFiles(fullPath, path.join(basePath, item));
      files.push(...categoryFiles);
    } else if (path.extname(item) === ".mdx") {
      // MDX 파일인 경우
      const category = basePath || "uncategorized";
      files.push({
        file: fullPath,
        category: category,
        relativePath: path.join(basePath, item),
      });
    }
  }

  return files;
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, "utf-8");
  return parseFrontmatter(rawContent);
}

export function getBlogPosts(): PostWithCategory[] {
  const contentsDir = path.join(process.cwd(), "src", "contents");
  const allFiles = getAllMDXFiles(contentsDir);

  return allFiles.map(({ file, category, relativePath }) => {
    const { metadata, content } = readMDXFile(file);
    const slug = path.basename(file, path.extname(file));

    return {
      metadata,
      slug,
      content,
      category,
      fullPath: relativePath.replace(/\.mdx$/, ""),
    };
  });
}

export function getPostsByCategory(category: string): PostWithCategory[] {
  const allPosts = getBlogPosts();
  return allPosts.filter((post) => post.category === category);
}

export function getAllCategories(): CategoryInfo[] {
  const allPosts = getBlogPosts();
  const categoryMap = new Map<string, number>();

  allPosts.forEach((post) => {
    const count = categoryMap.get(post.category) || 0;
    categoryMap.set(post.category, count + 1);
  });

  return Array.from(categoryMap.entries()).map(([name, count]) => ({
    name,
    count,
  }));
}

export function getPostBySlug(category: string, slug: string): PostWithCategory | undefined {
  const allPosts = getBlogPosts();
  return allPosts.find((post) => post.category === category && post.slug === slug);
}

// 기존 함수와의 호환성을 위해 유지 (deprecated)
export function getBlogPostsLegacy() {
  return getBlogPosts().map((post) => ({
    metadata: post.metadata,
    slug: post.slug,
    content: post.content,
  }));
}

// 검색용 데이터 타입
export interface SearchData {
  slug: string;
  category: string;
  title: string;
  summary: string;
  publishedAt: string;
  image?: string;
}

// 검색 데이터 생성 함수
export function generateSearchData(): SearchData[] {
  const posts = getBlogPosts();

  const searchData = posts.map((post) => ({
    slug: post.slug,
    category: post.category,
    title: post.metadata.title,
    summary: post.metadata.summary,
    publishedAt: post.metadata.publishedAt,
    image: post.metadata.image,
  }));

  // 발행일 기준으로 정렬 (최신순)
  return searchData.sort((a, b) => {
    if (new Date(a.publishedAt) > new Date(b.publishedAt)) {
      return -1;
    }
    return 1;
  });
}

// generateSearchDataFile 함수는 Context 방식으로 변경되면서 더 이상 사용되지 않음
// export function generateSearchDataFile(...) { ... }
