import apiClient from './client';
import { DashboardSummary } from '@/lib/types/dashboard.types';

export const dashboardApi = {
  // 대시보드 요약 데이터 조회
  getSummary: async (teamId: string): Promise<DashboardSummary> => {
    const response = await apiClient.get<DashboardSummary>(`/dashboard/summary?teamId=${teamId}`);
    return response.data;
  },
};

