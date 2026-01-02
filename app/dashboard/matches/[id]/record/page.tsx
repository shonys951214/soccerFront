'use client';

import { useParams, useRouter } from 'next/navigation';
import MatchRecordForm from '@/components/matches/MatchRecordForm';
import { useTeamId } from '@/lib/hooks/useTeamId';
import TeamRequiredWrapper from '@/components/common/TeamRequiredWrapper';
import BackLink from '@/components/common/BackLink';

export default function MatchRecordPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params.id as string;
  const { teamId } = useTeamId();

  const handleSuccess = () => {
    router.push(`/dashboard/matches/${matchId}`);
  };

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

