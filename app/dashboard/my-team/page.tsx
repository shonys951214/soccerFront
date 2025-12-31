'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTeamId } from '@/lib/hooks/useTeamId';
import { teamsApi } from '@/lib/api/teams.api';
import { TeamDetail, UserTeam } from '@/lib/types/team.types';
import Loading from '@/components/common/Loading';
import Button from '@/components/common/Button';

export default function MyTeamPage() {
  const router = useRouter();
  const { teamId, isLoading: teamIdLoading } = useTeamId();
  const [team, setTeam] = useState<TeamDetail | null>(null);
  const [userTeam, setUserTeam] = useState<UserTeam | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLeaving, setIsLeaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!teamId) return;

      setIsLoading(true);
      try {
        const [teamData, userTeamData] = await Promise.all([
          teamsApi.getTeam(teamId),
          teamsApi.getMyTeam(),
        ]);
        setTeam(teamData);
        setUserTeam(userTeamData);
      } catch (err: any) {
        setError('팀 정보를 불러오는데 실패했습니다.');
        console.error('Failed to fetch team:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (teamId) {
      fetchData();
    }
  }, [teamId]);

  const handleLeaveTeam = async () => {
    if (!teamId || !confirm('정말로 팀을 탈퇴하시겠습니까?')) return;
    
    setIsLeaving(true);
    try {
      await teamsApi.leaveTeam(teamId);
      localStorage.removeItem('teamId');
      router.push('/team-select');
    } catch (err: any) {
      alert(err.response?.data?.message || '팀 탈퇴에 실패했습니다.');
    } finally {
      setIsLeaving(false);
    }
  };

  const handleDeleteTeam = async () => {
    if (!teamId || !confirm('정말로 팀을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;
    
    setIsDeleting(true);
    try {
      await teamsApi.deleteTeam(teamId);
      localStorage.removeItem('teamId');
      router.push('/team-select');
    } catch (err: any) {
      alert(err.response?.data?.message || '팀 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

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

          {/* 팀 관리 버튼 */}
          {userTeam && (
            <div className="pt-4 border-t border-gray-200">
              {userTeam.role === 'captain' ? (
                <Button
                  variant="danger"
                  size="md"
                  className="w-full"
                  onClick={handleDeleteTeam}
                  isLoading={isDeleting}
                >
                  팀 삭제
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="md"
                  className="w-full text-red-600 border-red-300 hover:bg-red-50"
                  onClick={handleLeaveTeam}
                  isLoading={isLeaving}
                >
                  팀 탈퇴
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

