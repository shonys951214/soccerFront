/**
 * 폼 검증 유틸리티 함수들
 */

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^010-\d{4}-\d{4}$/;
  return phoneRegex.test(phone.trim());
};

export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 6) {
    return { isValid: false, message: '비밀번호는 최소 6자 이상이어야 합니다.' };
  }
  return { isValid: true };
};

export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
): { isValid: boolean; message?: string } => {
  if (password !== confirmPassword) {
    return { isValid: false, message: '비밀번호와 비밀번호 확인이 일치하지 않습니다.' };
  }
  return { isValid: true };
};

export const validateImageFile = (file: File): { isValid: boolean; message?: string } => {
  if (!file.type.startsWith('image/')) {
    return { isValid: false, message: '이미지 파일만 업로드 가능합니다.' };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { isValid: false, message: '파일 크기는 5MB 이하여야 합니다.' };
  }

  return { isValid: true };
};

export const formatPhoneNumber = (value: string): string => {
  // 숫자와 하이픈만 허용
  const cleaned = value.replace(/[^0-9-]/g, '');
  // 하이픈 제거
  let formatted = cleaned.replace(/-/g, '');
  
  // 자동으로 하이픈 추가
  if (formatted.length > 3 && formatted.length <= 7) {
    formatted = formatted.slice(0, 3) + '-' + formatted.slice(3);
  } else if (formatted.length > 7) {
    formatted = formatted.slice(0, 3) + '-' + formatted.slice(3, 7) + '-' + formatted.slice(7, 11);
  }
  
  return formatted;
};

