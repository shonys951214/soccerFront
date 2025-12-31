'use client';

import { useEffect, useState } from 'react';
import { useTeamId } from '@/lib/hooks/useTeamId';
import { teamsApi } from '@/lib/api/teams.api';
import { TeamDetail } from '@/lib/types/team.types';
import Loading from '@/components/common/Loading';

export default function MyTeamPage() {
  const { teamId, isLoading: teamIdLoading } = useTeamId();
  const [team, setTeam] = useState<TeamDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeam = async () => {
      if (!teamId) return;

      setIsLoading(true);
      try {
        const teamData = await teamsApi.getTeam(teamId);
        setTeam(teamData);
      } catch (err: any) {
        setError('팀 정보를 불러오는데 실패했습니다.');
        console.error('Failed to fetch team:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (teamId) {
      fetchTeam();
    }
  }, [teamId]);

  if (teamIdLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Loading size="lg" />
        </div>
      </div>
    );
  }

  if (!teamId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">팀에 가입되어 있지 않습니다.</p>
            <a
              href="/team-select"
              className="text-red-600 hover:text-red-700 underline"
            >
              클럽 생성 또는 가입하기
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!team) {
    return null;
  }

  // createdAt에서 년도와 월만 추출
  const formatCreatedDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `${year}년 ${month}월`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-0">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">우리 팀 소개</h1>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* 팀 로고/사진 */}
        {team.logo ? (
          <div className="w-full h-48 sm:h-64 bg-gray-200 flex items-center justify-center">
            <img
              src={team.logo}
              alt={team.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-48 sm:h-64 bg-gray-200 flex items-center justify-center">
            <div className="text-gray-400 text-4xl sm:text-6xl">⚽</div>
          </div>
        )}

        <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
          {/* 팀명 */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{team.name}</h2>
          </div>

          {/* 지역 정보 */}
          {team.region && (
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">지역</h3>
              <p className="text-base sm:text-lg text-gray-900">{team.region}</p>
            </div>
          )}

          {/* 팀 설명 */}
          {team.description && (
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">팀 소개</h3>
              <p className="text-sm sm:text-base text-gray-900 whitespace-pre-wrap break-words">{team.description}</p>
            </div>
          )}

          {/* 팀장 정보 */}
          {team.captain && (
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">팀장</h3>
              <p className="text-base sm:text-lg text-gray-900">{team.captain.name}</p>
            </div>
          )}

          {/* 팀 시작일 */}
          <div>
            <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">팀 시작일</h3>
            <p className="text-base sm:text-lg text-gray-900">{formatCreatedDate(team.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

