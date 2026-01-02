'use client';

import MatchList from '@/components/matches/MatchList';
import { useTeamId } from '@/lib/hooks/useTeamId';
import TeamRequiredWrapper from '@/components/common/TeamRequiredWrapper';

export default function MatchesPage() {
  const { teamId } = useTeamId();

  return (
    <TeamRequiredWrapper>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">경기 목록</h1>
      {teamId && <MatchList teamId={teamId} canCreate={true} />}
    </TeamRequiredWrapper>
  );
}

