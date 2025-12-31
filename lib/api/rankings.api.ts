import apiClient from './client';
import { Rankings, RankingPlayer } from '@/lib/types/rankings.types';

export const rankingsApi = {
  // 개인 랭킹 조회
  getRankings: async (teamId: string): Promise<Rankings> => {
    const response = await apiClient.get<Rankings>(`/rankings?teamId=${teamId}`);
    return response.data;
  },

  // 참석 경기 랭킹
  getAttendanceRankings: async (teamId: string): Promise<RankingPlayer[]> => {
    const response = await apiClient.get<RankingPlayer[]>(
      `/rankings/attendance?teamId=${teamId}`
    );
    return response.data;
  },

  // 출전 게임 랭킹
  getGameRankings: async (teamId: string): Promise<RankingPlayer[]> => {
    const response = await apiClient.get<RankingPlayer[]>(
      `/rankings/games?teamId=${teamId}`
    );
    return response.data;
  },

  // 득점 랭킹
  getGoalRankings: async (teamId: string): Promise<RankingPlayer[]> => {
    const response = await apiClient.get<RankingPlayer[]>(
      `/rankings/goals?teamId=${teamId}`
    );
    return response.data;
  },

  // 도움 랭킹
  getAssistRankings: async (teamId: string): Promise<RankingPlayer[]> => {
    const response = await apiClient.get<RankingPlayer[]>(
      `/rankings/assists?teamId=${teamId}`
    );
    return response.data;
  },
};

