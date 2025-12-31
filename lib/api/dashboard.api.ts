import apiClient from './client';
import { DashboardSummary } from '@/lib/types/dashboard.types';

// 백엔드 응답 타입 (실제 응답 구조)
interface BackendDashboardResponse {
  nextMatch?: any;
  teamComposition: any;
  teamStatistics?: {
    matchStatistics?: {
      matchCount: number;
      wins: number;
      draws: number;
      losses: number;
      goalsPerMatch: number;
      opponentGoalsPerMatch: number;
      cleanSheetRatio: number;
      noGoalRatio: number;
      cleanSheetMatches: number;
      noGoalMatches: number;
    };
    gameStatistics?: {
      gameCount: number;
      wins: number;
      draws: number;
      losses: number;
      goalsPerGame: number;
      opponentGoalsPerGame: number;
      cleanSheetRatio: number;
      noGoalRatio: number;
      cleanSheetGames: number;
      noGoalGames: number;
    };
    totalStatistics?: {
      totalGoals: number;
      totalOpponentGoals: number;
      goalDifference: number;
      totalAssists: number;
      fieldGoals: number;
      freeKickGoals: number;
      penaltyGoals: number;
      ownGoals: number;
    };
  };
  top10?: any;
  attendanceSummary?: any;
}

export const dashboardApi = {
  // 대시보드 요약 데이터 조회
  getSummary: async (teamId: string): Promise<DashboardSummary> => {
    const response = await apiClient.get<BackendDashboardResponse>(`/dashboard/summary?teamId=${teamId}`);
    const data = response.data;
    
    // 백엔드 응답을 프론트엔드 형식으로 변환
    return {
      nextMatch: data.nextMatch,
      teamComposition: data.teamComposition,
      teamStats: data.teamStatistics ? {
        matchStats: data.teamStatistics.matchStatistics ? {
          matchCount: data.teamStatistics.matchStatistics.matchCount,
          wins: data.teamStatistics.matchStatistics.wins,
          draws: data.teamStatistics.matchStatistics.draws,
          losses: data.teamStatistics.matchStatistics.losses,
          goalsPerMatch: data.teamStatistics.matchStatistics.goalsPerMatch,
          concededPerMatch: data.teamStatistics.matchStatistics.opponentGoalsPerMatch,
          cleanSheetRate: data.teamStatistics.matchStatistics.cleanSheetRatio,
          noGoalRate: data.teamStatistics.matchStatistics.noGoalRatio,
          cleanSheetMatches: data.teamStatistics.matchStatistics.cleanSheetMatches,
          noGoalMatches: data.teamStatistics.matchStatistics.noGoalMatches,
        } : undefined,
        gameStats: data.teamStatistics.gameStatistics ? {
          gameCount: data.teamStatistics.gameStatistics.gameCount,
          wins: data.teamStatistics.gameStatistics.wins,
          draws: data.teamStatistics.gameStatistics.draws,
          losses: data.teamStatistics.gameStatistics.losses,
          goalsPerGame: data.teamStatistics.gameStatistics.goalsPerGame,
          concededPerGame: data.teamStatistics.gameStatistics.opponentGoalsPerGame,
          cleanSheetRate: data.teamStatistics.gameStatistics.cleanSheetRatio,
          noGoalRate: data.teamStatistics.gameStatistics.noGoalRatio,
          cleanSheetGames: data.teamStatistics.gameStatistics.cleanSheetGames,
          noGoalGames: data.teamStatistics.gameStatistics.noGoalGames,
        } : undefined,
        totalGoals: data.teamStatistics.totalStatistics ? {
          totalGoals: data.teamStatistics.totalStatistics.totalGoals,
          totalConceded: data.teamStatistics.totalStatistics.totalOpponentGoals,
          goalDifference: data.teamStatistics.totalStatistics.goalDifference,
          assists: data.teamStatistics.totalStatistics.totalAssists,
          fieldGoals: data.teamStatistics.totalStatistics.fieldGoals,
          freeKickGoals: data.teamStatistics.totalStatistics.freeKickGoals,
          penaltyGoals: data.teamStatistics.totalStatistics.penaltyGoals,
          ownGoals: data.teamStatistics.totalStatistics.ownGoals,
        } : undefined,
      } : undefined,
      top10: data.top10,
      attendance: data.attendanceSummary,
    };
  },
};

