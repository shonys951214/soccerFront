'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMatchForm } from '@/lib/hooks/useMatchForm';
import { teamsApi } from '@/lib/api/teams.api';
import { UserTeam } from '@/lib/types/team.types';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Loading from '@/components/common/Loading';
import PageLayout from '@/components/common/PageLayout';

export default function EditMatchPage() {
  const router = useRouter();
  const params = useParams();
  const matchId = params.id as string;
  const [userTeam, setUserTeam] = useState<UserTeam | null>(null);
  const [isCheckingPermission, setIsCheckingPermission] = useState(true);
  
  const {
    match,
    formData,
    setFormData,
    isLoading,
    isSaving,
    error,
    handleSubmit,
  } = useMatchForm(matchId);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const teamData = await teamsApi.getMyTeam();
        setUserTeam(teamData);
        
        // 팀장 또는 부팀장이 아니면 접근 불가
        if (teamData && teamData.role !== 'captain' && teamData.role !== 'vice_captain') {
          alert('경기 수정은 팀장 또는 부팀장만 가능합니다.');
          router.push(`/dashboard/matches/${matchId}`);
          return;
        }
      } catch (err) {
        console.error('Failed to check permission:', err);
        alert('권한을 확인할 수 없습니다.');
        router.push(`/dashboard/matches/${matchId}`);
      } finally {
        setIsCheckingPermission(false);
      }
    };

    checkPermission();
  }, [matchId, router]);

  if (isCheckingPermission || isLoading) {
    return <PageLayout isLoading={true} />;
  }

  // 권한이 없으면 아무것도 렌더링하지 않음 (이미 리다이렉트됨)
  if (!userTeam || (userTeam.role !== 'captain' && userTeam.role !== 'vice_captain')) {
    return null;
  }

  if (!match) {
    return (
      <PageLayout>
        <div className="text-gray-500 text-center py-8">경기 정보가 없습니다.</div>
      </PageLayout>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">경기 수정</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <Input
          type="date"
          label="날짜 *"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />

        <Input
          type="time"
          label="시간"
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
        />

        <Input
          type="text"
          label="장소"
          placeholder="경기 장소를 입력하세요"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />

        <Input
          type="text"
          label="상대팀 *"
          placeholder="상대팀 이름을 입력하세요"
          value={formData.opponentTeamName}
          onChange={(e) => setFormData({ ...formData, opponentTeamName: e.target.value })}
          required
        />

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="flex-1"
            disabled={isSaving}
          >
            취소
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSaving}
            className="flex-1"
          >
            수정하기
          </Button>
        </div>
      </form>
    </div>
  );
}

