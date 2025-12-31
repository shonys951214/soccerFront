'use client';

import { useState } from 'react';
import { matchesApi } from '@/lib/api/matches.api';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

interface CreateMatchFormProps {
  teamId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CreateMatchForm({
  teamId,
  onSuccess,
  onCancel,
}: CreateMatchFormProps) {
  const [opponentTeamName, setOpponentTeamName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!opponentTeamName.trim()) {
      setError('상대팀 이름을 입력해주세요.');
      return;
    }

    if (!date) {
      setError('날짜를 선택해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      await matchesApi.createMatch({
        teamId,
        opponentTeamName: opponentTeamName.trim(),
        date,
        time: time || undefined,
        location: location || undefined,
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || '경기 등록에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        label="상대팀 이름 *"
        placeholder="상대팀 이름을 입력하세요"
        value={opponentTeamName}
        onChange={(e) => setOpponentTeamName(e.target.value)}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          날짜 *
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <Input
        type="time"
        label="시간"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />

      <Input
        type="text"
        label="장소"
        placeholder="경기 장소를 입력하세요"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
          disabled={isLoading}
        >
          취소
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className="flex-1"
        >
          등록하기
        </Button>
      </div>
    </form>
  );
}

