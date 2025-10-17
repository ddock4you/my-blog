import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import { slugify } from './utils';

export type SeriesMeta = {
  title: string;
  inSeries: '완료' | '연재중' | '중단'; // 연재 상태
  description?: string;
  order?: string[]; // 시리즈 내 포스트 slug 순서
  aliases?: string[]; // 시리즈 식별을 위한 별칭(표기 차이 등)
  coverImage?: string; // 시리즈 커버 이미지 경로(선택)
};

const SERIES_DATA_DIR = path.join(process.cwd(), 'src', 'data', 'series');

type SeriesRegistry = Record<string, SeriesMeta>;

let cachedRegistry: SeriesRegistry | null = null;

function safeReadDir(dir: string): string[] {
  try {
    return fs.readdirSync(dir);
  } catch {
    return [];
  }
}

function loadSeriesRegistryFromDisk(): SeriesRegistry {
  const files = safeReadDir(SERIES_DATA_DIR).filter(f => /\.ya?ml$/i.test(f));
  const registry: SeriesRegistry = {};

  for (const file of files) {
    const fullPath = path.join(SERIES_DATA_DIR, file);
    try {
      const raw = fs.readFileSync(fullPath, 'utf-8');
      const data = YAML.parse(raw) || {};
      const key = path.basename(file, path.extname(file)); // 파일명으로 canonical key 생성

      const title: string = data.title || key;
      const description: string | undefined = data.description;
      const order: string[] | undefined = Array.isArray(data.order)
        ? data.order.map((v: unknown) => String(v))
        : undefined;
      const aliases: string[] | undefined = Array.isArray(data.aliases)
        ? data.aliases.map((v: unknown) => String(v))
        : undefined;
      const inSeriesRaw = data.inSeries;
      const allowed = ['완료', '연재중', '중단'] as const;
      const inSeries: '완료' | '연재중' | '중단' =
        typeof inSeriesRaw === 'string' && allowed.includes(inSeriesRaw as SeriesMeta['inSeries'])
          ? (inSeriesRaw as SeriesMeta['inSeries'])
          : '연재중';
      const coverImage: string | undefined =
        typeof data.coverImage === 'string' && data.coverImage.trim() !== ''
          ? String(data.coverImage)
          : undefined;

      registry[key] = { title, description, order, aliases, inSeries, coverImage };
    } catch {
      // 디스크 읽기/파싱 예외는 무시하고 다음 파일로 진행
    }
  }

  return registry;
}

export function getSeriesRegistry(): SeriesRegistry {
  if (cachedRegistry) return cachedRegistry;
  cachedRegistry = loadSeriesRegistryFromDisk();
  return cachedRegistry;
}

export function refreshSeriesRegistry(): void {
  cachedRegistry = loadSeriesRegistryFromDisk();
}

export function findSeriesKey(seriesName: string): string | undefined {
  const registry = getSeriesRegistry();
  const input = (seriesName || '').trim();
  if (!input) return undefined;

  const inputLower = input.toLowerCase();
  const inputSlug = slugify(input);

  for (const key of Object.keys(registry)) {
    const meta = registry[key];
    if (!meta) continue;

    // 1) 파일명과 직접 매칭(대소문자 무시)
    if (key.toLowerCase() === inputLower) return key;

    // 2) slug 동등성 매칭
    if (slugify(key) === inputSlug) return key;

    // 3) aliases 포함 여부(대소문자/slug 유연)
    const aliases = meta.aliases || [];
    if (aliases.some(a => a.toLowerCase() === inputLower || slugify(a) === inputSlug)) {
      return key;
    }
  }

  return undefined;
}

export function getSeriesOrder(seriesName: string): string[] {
  const registry = getSeriesRegistry();
  const key = findSeriesKey(seriesName);
  if (!key) return [];
  const order = registry[key]?.order || [];
  // 중복 제거 및 문자열화 보정
  const seen = new Set<string>();
  const normalized = order
    .map(slug => String(slug).trim())
    .filter(slug => !!slug && !seen.has(slug) && (seen.add(slug), true));
  return normalized;
}

// post?.series(문자열)로부터 시리즈 메타/정리 정보를 가져오기 위한 헬퍼
export function getSeriesMeta(seriesName: string): SeriesMeta | undefined {
  const registry = getSeriesRegistry();
  const key = findSeriesKey(seriesName);
  if (!key) return undefined;
  return registry[key];
}

export type ResolvedSeriesInfo = {
  key: string; // 레지스트리 키(파일명 기반 canonical)
  slug: string; // URL-friendly slug
  meta?: SeriesMeta; // 시리즈 메타(YAML)
  order: string[]; // 포스트 slug 정렬 우선순위
};

export function getSeriesInfoByName(seriesName: string): ResolvedSeriesInfo | undefined {
  const key = findSeriesKey(seriesName);
  if (!key) return undefined;
  const registry = getSeriesRegistry();
  const meta = registry[key];
  const slug = slugify(key);
  const order = getSeriesOrder(key);
  return { key, slug, meta, order };
}

// 구버전 사용 코드와 호환을 위해 유지: 정적 상수 대신 로더 기반 레지스트리를 노출
export const SERIES_REGISTRY: SeriesRegistry = getSeriesRegistry();
