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

  // 비밀번호 변경
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await apiClient.put('/users/password', {
      currentPassword,
      newPassword,
    });
  },

  // 프로필 이미지 업로드
  uploadProfileImage: async (file: File): Promise<{ imageUrl: string }> => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await apiClient.post<{ imageUrl: string }>('/users/profile/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // 계정 삭제
  deleteAccount: async (): Promise<void> => {
    await apiClient.delete('/users/profile');
  },
};

