import apiClient from './client';
import { CreateProfileRequest, UpdateProfileRequest, UserProfile } from '@/lib/types/user.types';

export const usersApi = {
  // 회원 정보 등록
  createProfile: async (data: CreateProfileRequest): Promise<UserProfile> => {
    const response = await apiClient.post<UserProfile>('/users/profile', data);
    return response.data;
  },

  // 회원 정보 수정
  updateProfile: async (data: UpdateProfileRequest): Promise<UserProfile> => {
    const response = await apiClient.put<UserProfile>('/users/profile', data);
    return response.data;
  },

  // 회원 정보 조회
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>('/users/profile');
    return response.data;
  },
};

