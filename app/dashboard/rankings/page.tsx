'use client';

import RankingsList from '@/components/rankings/RankingsList';
import { useTeamId } from '@/lib/hooks/useTeamId';
import Loading from '@/components/common/Loading';
import TeamNameLink from '@/components/common/TeamNameLink';

export default function RankingsPage() {
  const { teamId, isLoading } = useTeamId();

  if (isLoading) {
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

  return (
    <>
      <div className="mb-6">
        <TeamNameLink />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">개인 랭크</h1>
      <RankingsList teamId={teamId} />
    </>
  );
}

