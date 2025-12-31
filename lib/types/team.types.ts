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

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  name?: string; // 사용자 이름
  userName?: string; // 사용자 이름 (하위 호환성)
  jerseyNumber?: number;
  role: 'captain' | 'vice_captain' | 'member';
  status: 'active' | 'injured' | 'long_term_absence' | 'short_term_absence';
  joinedAt: string;
  phone?: string;
  birthdate?: string;
  positions?: string[];
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

