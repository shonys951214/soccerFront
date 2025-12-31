import apiClient from './client';
import {
  Match,
  MatchListItem,
  MatchDetail,
  CreateMatchRequest,
  UpdateMatchRequest,
  AttendanceVoteRequest,
  MatchAttendance,
} from '@/lib/types/match.types';

export const matchesApi = {
  // 경기 목록 조회
  getMatches: async (
    teamId: string,
    year?: number,
    month?: number
  ): Promise<MatchListItem[]> => {
    const params = new URLSearchParams({ teamId });
    if (year) params.append('year', year.toString());
    if (month) params.append('month', month.toString());
    
    const response = await apiClient.get<MatchListItem[]>(`/matches?${params.toString()}`);
    return response.data;
  },

  // 경기 상세 조회
  getMatch: async (id: string): Promise<MatchDetail> => {
    const response = await apiClient.get<MatchDetail>(`/matches/${id}`);
    return response.data;
  },

  // 경기 등록
  createMatch: async (data: CreateMatchRequest): Promise<Match> => {
    const response = await apiClient.post<Match>('/matches', data);
    return response.data;
  },

  // 경기 수정
  updateMatch: async (id: string, data: UpdateMatchRequest): Promise<Match> => {
    const response = await apiClient.put<Match>(`/matches/${id}`, data);
    return response.data;
  },

  // 경기 삭제
  deleteMatch: async (id: string): Promise<void> => {
    await apiClient.delete(`/matches/${id}`);
  },

  // 게임별 상세 기록 조회
  getMatchGames: async (id: string): Promise<Game[]> => {
    const response = await apiClient.get<Game[]>(`/matches/${id}/games`);
    return response.data;
  },

  // 참석 투표
  voteAttendance: async (
    matchId: string,
    data: AttendanceVoteRequest
  ): Promise<MatchAttendance> => {
    const response = await apiClient.post<MatchAttendance>(
      `/matches/${matchId}/attendance`,
      data
    );
    return response.data;
  },

  // 참석 현황 조회
  getAttendance: async (matchId: string): Promise<MatchAttendance[]> => {
    const response = await apiClient.get<MatchAttendance[]>(
      `/matches/${matchId}/attendance`
    );
    return response.data;
  },

  // 경기 결과 기록
  recordMatch: async (
    matchId: string,
    data: RecordMatchRequest
  ): Promise<void> => {
    await apiClient.post(`/matches/${matchId}/record`, data);
  },

  // 경기 결과 조회
  getMatchRecord: async (matchId: string): Promise<any> => {
    const response = await apiClient.get(`/matches/${matchId}/record`);
    return response.data;
  },
};

