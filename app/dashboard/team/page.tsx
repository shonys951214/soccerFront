'use client';

import TeamMembers from '@/components/team/TeamMembers';
import { useTeamId } from '@/lib/hooks/useTeamId';
import TeamRequiredWrapper from '@/components/common/TeamRequiredWrapper';

export default function TeamPage() {
  const { teamId } = useTeamId();

  return (
    <TeamRequiredWrapper>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">팀 구성</h1>
      {teamId && <TeamMembers teamId={teamId} canManage={true} />}
    </TeamRequiredWrapper>
  );
}

