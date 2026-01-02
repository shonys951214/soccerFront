'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { DashboardSummary } from '@/lib/types/dashboard.types';
import { dashboardApi } from '@/lib/api/dashboard.api';
import NextMatchCard from './NextMatchCard';
import TeamStatsCard from './TeamStatsCard';
import Top10List from './Top10List';
import AttendanceSummary from './AttendanceSummary';
import Loading from '@/components/common/Loading';

interface SummaryTabProps {
  teamId: string;
}

export default function SummaryTab({ teamId }: SummaryTabProps) {
  const pathname = usePathname();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    if (!teamId) return;
    
    setIsLoading(true);
    setError('');
    try {
      const summary = await dashboardApi.getSummary(teamId);
      setData(summary);
    } catch (err: any) {
      setError('데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 경로가 변경되어 대시보드로 돌아왔을 때 데이터 새로고침 (투표 후 돌아왔을 때)
  useEffect(() => {
    if (pathname === '/dashboard') {
      fetchData();
    }
  }, [pathname, fetchData]);

  // 페이지가 보일 때 데이터 새로고침 (다른 탭에서 돌아왔을 때)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && pathname === '/dashboard') {
        fetchData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchData, pathname]);

  if (isLoading) {
    return <Loading size="lg" className="py-12" />;
  }

  if (error) {
    return <div className="text-red-600 text-center py-8">{error}</div>;
  }

  if (!data) {
    return <div className="text-gray-500 text-center py-8">데이터가 없습니다.</div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 상단: 다음경기, 팀구성, Top10 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <NextMatchCard match={data.nextMatch} />
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">팀 구성</h2>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              총 인원: <span className="font-semibold text-gray-900">{data.teamComposition.totalMembers}명</span>
            </p>
            <div className="grid grid-cols-4 gap-2 sm:gap-3 mt-4">
              <div className="text-center p-2 bg-gray-50 rounded">
                <p className="text-xs text-gray-600">GK</p>
                <p className="text-lg font-semibold">{data.teamComposition.positionCount.GK}</p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <p className="text-xs text-gray-600">DF</p>
                <p className="text-lg font-semibold">{data.teamComposition.positionCount.DF}</p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <p className="text-xs text-gray-600">MF</p>
                <p className="text-lg font-semibold">{data.teamComposition.positionCount.MF}</p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <p className="text-xs text-gray-600">FW</p>
                <p className="text-lg font-semibold">{data.teamComposition.positionCount.FW}</p>
              </div>
            </div>
          </div>
        </div>
        {data.top10 && (
          <div className="md:col-span-2 lg:col-span-1">
            <Top10List
              appearances={data.top10.appearances}
              goals={data.top10.goals}
              assists={data.top10.assists}
              winRate={data.top10.winRate}
            />
          </div>
        )}
      </div>

      {data.teamStats && (
        <TeamStatsCard
          matchStats={data.teamStats.matchStats}
          gameStats={data.teamStats.gameStats}
          totalGoals={data.teamStats.totalGoals}
        />
      )}

      {data.attendance && <AttendanceSummary attendance={data.attendance} />}
    </div>
  );
}

