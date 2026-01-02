'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import MatchRecordForm from '@/components/matches/MatchRecordForm';
import { useTeamId } from '@/lib/hooks/useTeamId';
import { teamsApi } from '@/lib/api/teams.api';
import { UserTeam } from '@/lib/types/team.types';
import TeamRequiredWrapper from '@/components/common/TeamRequiredWrapper';
import BackLink from '@/components/common/BackLink';
import Loading from '@/components/common/Loading';

export default function MatchRecordPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params.id as string;
  const { teamId } = useTeamId();
  const [userTeam, setUserTeam] = useState<UserTeam | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const teamData = await teamsApi.getMyTeam();
        setUserTeam(teamData);
        
        // 팀장 또는 부팀장이 아니면 접근 불가
        if (teamData && teamData.role !== 'captain' && teamData.role !== 'vice_captain') {
          alert('경기 기록 입력은 팀장 또는 부팀장만 가능합니다.');
          router.push(`/dashboard/matches/${matchId}`);
          return;
        }
      } catch (err) {
        console.error('Failed to check permission:', err);
        alert('권한을 확인할 수 없습니다.');
        router.push(`/dashboard/matches/${matchId}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (teamId) {
      checkPermission();
    }
  }, [teamId, matchId, router]);

  const handleSuccess = () => {
    router.push(`/dashboard/matches/${matchId}`);
  };

  if (isLoading) {
    return (
      <TeamRequiredWrapper>
        <div className="flex items-center justify-center py-12">
          <Loading size="lg" />
        </div>
      </TeamRequiredWrapper>
    );
  }

  // 권한이 없으면 아무것도 렌더링하지 않음 (이미 리다이렉트됨)
  if (!userTeam || (userTeam.role !== 'captain' && userTeam.role !== 'vice_captain')) {
    return null;
  }

  return (
    <TeamRequiredWrapper>
      <BackLink href={`/dashboard/matches/${matchId}`} label="← 경기 상세로" />
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">경기 기록 입력</h1>
        {teamId && <MatchRecordForm matchId={matchId} teamId={teamId} onSuccess={handleSuccess} />}
      </div>
    </TeamRequiredWrapper>
  );
}

