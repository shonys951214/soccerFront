import apiClient from './client';
import { LoginRequest, SignupRequest, AuthResponse } from '@/lib/types/auth.types';

export const authApi = {
  // 로그인
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  },

  // 회원가입
  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/signup', data);
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  },

  // 소셜 로그인
  socialLogin: async (provider: string, token: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/social', {
      provider,
      token,
    });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  },

  // 로그아웃
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('token');
  },

  // 토큰 갱신
  refreshToken: async (): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/refresh');
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  },

  // 초대 링크 검증
  verifyInvite: async (token: string) => {
    const response = await apiClient.get(`/auth/invite/${token}`);
    return response.data;
  },

  // 초대 수락
  acceptInvite: async (token: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(`/auth/invite/${token}/accept`);
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  },
};

