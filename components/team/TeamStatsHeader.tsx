'use client';

import { TeamStats } from '@/lib/types/team.types';

interface TeamStatsHeaderProps {
  stats?: TeamStats;
}

export default function TeamStatsHeader({ stats }: TeamStatsHeaderProps) {
  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <p className="text-gray-500">통계 데이터를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">팀 구성 통계</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <StatItem label="총 인원" value={`${stats.totalMembers}명`} />
        <StatItem
          label="평균 연령"
          value={stats.averageAge > 0 ? `${stats.averageAge.toFixed(1)}세` : '-'}
        />
        <StatItem
          label="평균 참석률"
          value={
            stats.averageAttendance !== undefined && !isNaN(stats.averageAttendance)
              ? `${(stats.averageAttendance * 100).toFixed(1)}%`
              : '0.0%'
          }
        />
      </div>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center p-3 sm:p-4 bg-gray-50 rounded">
      <p className="text-xs sm:text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-xl sm:text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

