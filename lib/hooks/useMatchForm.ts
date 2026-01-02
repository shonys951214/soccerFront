import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { matchesApi } from '@/lib/api/matches.api';
import { MatchDetail, UpdateMatchRequest } from '@/lib/types/match.types';
import { formatDateToInput } from '@/lib/utils/format';
import { getErrorMessage } from '@/lib/utils/error';

export function useMatchForm(matchId: string) {
  const router = useRouter();
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
    if (matchId) {
      fetchMatch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchId]);

  const fetchMatch = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await matchesApi.getMatch(matchId);
      setMatch(data);
      setFormData({
        date: formatDateToInput(data.date),
        time: data.time || '',
        location: data.location || '',
        opponentTeamName: data.opponentTeamName,
      });
    } catch (err) {
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
    } catch (err) {
      setError(getErrorMessage(err, '경기 수정에 실패했습니다.'));
    } finally {
      setIsSaving(false);
    }
  };

  return {
    match,
    formData,
    setFormData,
    isLoading,
    isSaving,
    error,
    handleSubmit,
  };
}

