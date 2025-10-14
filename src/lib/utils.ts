import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string, includeRelative = false) {
  const currentDate = new Date();
  if (!date.includes('T')) {
    date = `${date}T00:00:00`;
  }
  const targetDate = new Date(date);

  // 한국어 표기 (예: 2025년 9월 1일)
  const fullDate = targetDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (!includeRelative) {
    return fullDate;
  }

  // 단순 상대 표기 (일/월/년 차이 기준)
  const diffMs = currentDate.getTime() - targetDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let relative = '오늘';
  if (diffDays > 0) {
    if (diffDays < 30) {
      relative = `${diffDays}일 전`;
    } else if (diffDays < 365) {
      relative = `${Math.floor(diffDays / 30)}개월 전`;
    } else {
      relative = `${Math.floor(diffDays / 365)}년 전`;
    }
  }

  return `${fullDate} (${relative})`;
}

/**
 * 게시글 내용의 예상 읽기 시간을 계산합니다.
 *
 * @param content - 게시글 내용 (마크다운 텍스트)
 * @returns 읽기 시간 (분 단위, 최소 1분)
 */
export function calculateReadingTime(content: string): number {
  // 마크다운 문법 제거 (헤더, 코드 블록, 링크 등)
  const cleanContent = content
    .replace(/#{1,6}\s+/g, '') // 헤더 제거
    .replace(/\*\*(.*?)\*\*/g, '$1') // 볼드 제거
    .replace(/\*(.*?)\*/g, '$1') // 이탤릭 제거
    .replace(/`(.*?)`/g, '$1') // 인라인 코드 제거
    .replace(/```[\s\S]*?```/g, '') // 코드 블록 제거
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 링크 제거
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1') // 이미지 제거
    .replace(/^\s*[-*+]\s+/gm, '') // 리스트 마커 제거
    .replace(/^\s*\d+\.\s+/gm, '') // 번호 리스트 마커 제거
    .replace(/\n+/g, ' ') // 줄바꿈을 공백으로 변경
    .replace(/\s+/g, ' ') // 연속된 공백을 하나로 변경
    .trim();

  // 공백을 기준으로 단어 수 계산
  const wordCount = cleanContent.split(' ').filter(word => word.length > 0).length;

  // 한국어 기준 분당 200단어 읽기 속도 적용
  const wordsPerMinute = 200;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);

  // 최소 1분으로 설정
  return Math.max(1, readingTime);
}

/**
 * 읽기 시간을 한국어로 포맷팅합니다.
 *
 * @param minutes - 읽기 시간 (분)
 * @returns 포맷팅된 읽기 시간 문자열
 */
export function formatReadingTime(minutes: number): string {
  if (minutes === 1) {
    return '1분 읽기';
  }
  return `${minutes}분 읽기`;
}

/**
 * 간단한 슬러그 생성기: 앞뒤 공백 제거 후 공백을 하이픈으로 바꾸고 소문자로 변환합니다.
 * 한글/비영문자는 그대로 유지합니다(Next.js 라우팅에 사용 가능).
 */
export function slugify(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, '-');
}
