import apiClient from './client';
import { Team, CreateTeamRequest, TeamStats, TeamMember, UserTeam } from '@/lib/types/team.types';

export const teamsApi = {
  // 클럽 생성
  createTeam: async (data: CreateTeamRequest): Promise<Team> => {
    const response = await apiClient.post<Team>('/teams', data);
    return response.data;
  },

  // 공개 팀 목록 조회
  getPublicTeams: async (): Promise<Team[]> => {
    const response = await apiClient.get<Team[]>('/teams/public');
    return response.data;
  },

  // 현재 사용자의 팀 조회
  getMyTeam: async (): Promise<UserTeam | null> => {
    const response = await apiClient.get<UserTeam | null>('/teams/my-team');
    return response.data;
  },

  // 클럽 가입
  joinTeam: async (teamId: string): Promise<void> => {
    await apiClient.post(`/teams/${teamId}/join`);
  },

  // 팀 구성 통계
  getTeamStats: async (teamId: string): Promise<TeamStats> => {
    const response = await apiClient.get<TeamStats>(`/teams/${teamId}/stats`);
    return response.data;
  },

  // 초대 링크 생성
  createInviteLink: async (teamId: string): Promise<{ token: string; link: string }> => {
    const response = await apiClient.post<{ token: string }>(`/teams/${teamId}/invite`);
    const token = response.data.token;
    const link = `${typeof window !== 'undefined' ? window.location.origin : ''}/invite/${token}`;
    return { token, link };
  },

  // 팀원 목록 조회
  getTeamMembers: async (teamId: string): Promise<TeamMember[]> => {
    const response = await apiClient.get<TeamMember[]>(`/teams/${teamId}/members`);
    return response.data;
  },
};

