// API 응답 기본 타입
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

// 에러 응답 타입
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

