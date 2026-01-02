'use client';

import { useState } from 'react';
import TeamMembers from '@/components/team/TeamMembers';
import MemberManagement from '@/components/team/MemberManagement';
import { useTeamId } from '@/lib/hooks/useTeamId';
import { useTeamData } from '@/lib/hooks/useTeamData';
import TeamRequiredWrapper from '@/components/common/TeamRequiredWrapper';
import PageLayout from '@/components/common/PageLayout';

type TabType = 'members' | 'management';

export default function TeamPage() {
  const { teamId } = useTeamId();
  const { userTeam, isLoading } = useTeamData(teamId);
  const [activeTab, setActiveTab] = useState<TabType>('members');

  const isCaptain = userTeam?.role === 'captain';

  if (isLoading) {
    return <PageLayout isLoading={true} />;
  }

  return (
    <TeamRequiredWrapper>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">팀 구성</h1>

      {/* 탭 네비게이션 */}
      {isCaptain && (
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('members')}
              className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'members'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              팀 구성
            </button>
            <button
              onClick={() => setActiveTab('management')}
              className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'management'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              회원관리
            </button>
          </nav>
        </div>
      )}

      {/* 탭 컨텐츠 */}
      {activeTab === 'members' ? (
        teamId && <TeamMembers teamId={teamId} canManage={true} />
      ) : (
        teamId && userTeam && <MemberManagement teamId={teamId} userTeam={userTeam} />
      )}
    </TeamRequiredWrapper>
  );
}

