/**
 * 에러 처리 유틸리티 함수들
 */

export const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    return response?.data?.message || defaultMessage;
  }
  return defaultMessage;
};

export const isApiError = (error: unknown): error is { response?: { data?: { message?: string }; status?: number } } => {
  return error !== null && typeof error === 'object' && 'response' in error;
};

