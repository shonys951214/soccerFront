/**
 * 포맷팅 유틸리티 함수들
 */

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const weekday = weekdays[date.getDay()];
  return `${year}-${month}-${day} (${weekday})`;
};

export const formatDateToInput = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatCreatedDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}년 ${month}월`;
};

export const formatDateLocale = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR');
};

