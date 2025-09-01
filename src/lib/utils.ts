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
