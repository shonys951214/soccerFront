import apiClient from './client';
import { TeamStats, GameStats, TotalGoals } from '@/lib/types/dashboard.types';

export const statisticsApi = {
  // 팀 기록 통계
  getTeamStats: async (teamId: string): Promise<{
    matchStats: TeamStats;
    gameStats: GameStats;
    totalGoals: TotalGoals;
  }> => {
    const response = await apiClient.get(`/statistics/team?teamId=${teamId}`);
    return response.data;
  },

  // Top10 랭킹
  getTop10: async (teamId: string): Promise<{
    appearances: any[];
    goals: any[];
    assists: any[];
    winRate: any[];
  }> => {
    const response = await apiClient.get(`/statistics/top10?teamId=${teamId}`);
    return response.data;
  },
};

