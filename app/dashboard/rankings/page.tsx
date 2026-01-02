'use client';

import RankingsList from '@/components/rankings/RankingsList';
import { useTeamId } from '@/lib/hooks/useTeamId';
import TeamRequiredWrapper from '@/components/common/TeamRequiredWrapper';

export default function RankingsPage() {
  const { teamId } = useTeamId();

  return (
    <TeamRequiredWrapper>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">개인 랭크</h1>
      {teamId && <RankingsList teamId={teamId} />}
    </TeamRequiredWrapper>
  );
}

