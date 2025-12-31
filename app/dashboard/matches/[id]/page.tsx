'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import MatchDetail from '@/components/matches/MatchDetail';
import Loading from '@/components/common/Loading';

export default function MatchDetailPage() {
  const params = useParams();
  const matchId = params.id as string;
  const [teamId, setTeamId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // localStorage에서 팀 ID 가져오기
    const teamId = localStorage.getItem('teamId');
    setTeamId(teamId);
    setIsLoading(false);
  }, []);

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
              className="text-blue-600 hover:text-blue-700 underline"
            >
              클럽 생성 또는 가입하기
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <a
            href="/dashboard/matches"
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            ← 경기 목록으로
          </a>
        </div>
        <MatchDetail matchId={matchId} teamId={teamId} canEdit={true} />
      </div>
    </div>
  );
}

