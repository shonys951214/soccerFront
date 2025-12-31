'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { matchesApi } from '@/lib/api/matches.api';
import { useTeamId } from '@/lib/hooks/useTeamId';
import { MatchDetail, UpdateMatchRequest } from '@/lib/types/match.types';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Loading from '@/components/common/Loading';

export default function EditMatchPage() {
  const router = useRouter();
  const params = useParams();
  const matchId = params.id as string;
  const { teamId, isLoading: isTeamLoading } = useTeamId();
  
  const [match, setMatch] = useState<MatchDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<UpdateMatchRequest>({
    date: '',
    time: '',
    location: '',
    opponentTeamName: '',
  });

  useEffect(() => {
    if (matchId && !isTeamLoading) {
      fetchMatch();
    }
  }, [matchId, isTeamLoading]);

  const fetchMatch = async () => {
    setIsLoading(true);
    try {
      const data = await matchesApi.getMatch(matchId);
      setMatch(data);
      setFormData({
        date: data.date.split('T')[0], // YYYY-MM-DD 형식으로 변환
        time: data.time || '',
        location: data.location || '',
        opponentTeamName: data.opponentTeamName,
      });
    } catch (err: any) {
      setError('경기 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      await matchesApi.updateMatch(matchId, formData);
      router.push(`/dashboard/matches/${matchId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || '경기 수정에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isTeamLoading || isLoading) {
    return <Loading size="lg" className="py-12" />;
  }

  if (!match) {
    return <div className="text-gray-500 text-center py-8">경기 정보가 없습니다.</div>;
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

