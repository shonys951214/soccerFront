// 팀 관련 타입
export interface Team {
  id: string;
  name: string;
  region?: string;
  description?: string;
  captainId: string;
  logo?: string;
  createdAt: string;
}

export interface CreateTeamRequest {
  name: string;
}

import { Position } from './user.types';

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  name?: string; // 사용자 이름
  userName?: string; // 사용자 이름 (하위 호환성)
  profileImage?: string; // 프로필 이미지
  jerseyNumber?: number;
  role: 'captain' | 'vice_captain' | 'member';
  status: 'active' | 'injured' | 'long_term_absence' | 'short_term_absence';
  joinedAt: string;
  phone?: string;
  birthdate?: string;
  positions?: Position[]; // Position 타입으로 변경
  summary?: string;
}

export interface TeamStats {
  totalMembers: number;
  averageAge: number;
  averageAttendance: number;
}

export interface UserTeam {
  teamId: string;
  teamName: string;
  role: 'captain' | 'vice_captain' | 'member';
  status: 'active' | 'injured' | 'long_term_absence' | 'short_term_absence';
}

export interface TeamDetail {
  id: string;
  name: string;
  region?: string;
  description?: string;
  logo?: string;
  captain: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
}

export interface JoinRequest {
  id: string;
  userId: string;
  userName: string;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  positions?: Position[];
  phone?: string;
  birthdate?: string;
  summary?: string;
  createdAt: string;
  reviewedAt?: string;
  // 내 가입신청 조회 시 추가 정보
  teamId?: string;
  teamName?: string;
}

