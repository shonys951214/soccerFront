// 인증 관련 타입
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
  // refresh_token은 HttpOnly Cookie에 저장되므로 타입에서 제외
}

export interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  provider: 'google' | 'kakao' | 'email';
}

