import apiClient from './client';
import { AttendanceSummary } from '@/lib/types/dashboard.types';

export const attendanceApi = {
  // 출석 관리 요약
  getSummary: async (teamId: string): Promise<AttendanceSummary> => {
    const response = await apiClient.get<AttendanceSummary>(`/attendance/summary?teamId=${teamId}`);
    return response.data;
  },
};

