'use client';

import { useState } from 'react';
import Input from '@/components/common/Input';
import PositionSelector from './PositionSelector';
import { Position } from '@/lib/types/user.types';

interface ProfileFormProps {
  onSubmit: (data: {
    name: string;
    birthdate: string;
    phone: string;
    positions: Position[];
    summary?: string;
  }) => Promise<void>;
  isLoading?: boolean;
}

export default function ProfileForm({ onSubmit, isLoading = false }: ProfileFormProps) {
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [phone, setPhone] = useState('');
  const [positions, setPositions] = useState<Position[]>([]);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }

    if (!birthdate) {
      setError('생년월일을 입력해주세요.');
      return;
    }

    if (!phone.trim()) {
      setError('연락처를 입력해주세요.');
      return;
    }

    if (positions.length === 0) {
      setError('최소 1개 이상의 포지션을 선택해주세요.');
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        birthdate: birthdate,
        phone: phone.trim(),
        positions,
        summary: summary.trim() || undefined,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || '등록에 실패했습니다.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        label="이름 *"
        placeholder="이름을 입력하세요"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          생년월일 *
        </label>
        <input
          type="date"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <Input
        type="tel"
        label="연락처 *"
        placeholder="010-0000-0000"
        value={phone}
        onChange={(e) => {
          const value = e.target.value.replace(/[^0-9-]/g, '');
          setPhone(value);
        }}
        required
      />

      <PositionSelector selectedPositions={positions} onChange={setPositions} />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          요약 (선수 설명)
        </label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="자기소개나 선수 설명을 입력하세요"
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? '등록 중...' : '등록하기'}
      </button>
    </form>
  );
}

