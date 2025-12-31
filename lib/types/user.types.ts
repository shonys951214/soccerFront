// 사용자 관련 타입
export type Position = 'GK' | 'DF' | 'MF' | 'FW';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  birthdate?: string;
  phone?: string;
  profileImage?: string;
  summary?: string;
  positions: Position[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProfileRequest {
  name: string;
  birthdate?: string;
  phone?: string;
  positions: Position[];
  summary?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  birthdate?: string;
  phone?: string;
  positions?: Position[];
  summary?: string;
}

