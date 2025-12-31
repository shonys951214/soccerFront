'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MatchRecordForm from '@/components/matches/MatchRecordForm';
import Loading from '@/components/common/Loading';

export default function MatchRecordPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params.id as string;
  const [teamId, setTeamId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // localStorage에서 팀 ID 가져오기
    const teamId = localStorage.getItem('teamId');
    setTeamId(teamId);
    setIsLoading(false);
  }, []);

  const handleSuccess = () => {
    router.push(`/dashboard/matches/${matchId}`);
  };

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
            href={`/dashboard/matches/${matchId}`}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            ← 경기 상세로
          </a>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">경기 기록 입력</h1>
          <MatchRecordForm matchId={matchId} teamId={teamId} onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
}

