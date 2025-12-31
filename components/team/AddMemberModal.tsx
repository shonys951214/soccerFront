'use client';

import { useState } from 'react';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { teamsApi } from '@/lib/api/teams.api';
import { usersApi } from '@/lib/api/users.api';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  onSuccess: () => void;
}

export default function AddMemberModal({
  isOpen,
  onClose,
  teamId,
  onSuccess,
}: AddMemberModalProps) {
  const [userId, setUserId] = useState('');
  const [jerseyNumber, setJerseyNumber] = useState('');
  const [status, setStatus] = useState<'active' | 'injured' | 'long_term_absence' | 'short_term_absence'>('active');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!userId.trim()) {
      setError('사용자 ID를 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      await teamsApi.addMember(teamId, {
        userId,
        jerseyNumber: jerseyNumber ? parseInt(jerseyNumber) : undefined,
        status,
      });
      onSuccess();
      onClose();
      // 폼 초기화
      setUserId('');
      setJerseyNumber('');
      setStatus('active');
    } catch (err: any) {
      setError(err.response?.data?.message || '팀원 추가에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="팀원 추가" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          label="사용자 ID *"
          placeholder="추가할 사용자의 ID를 입력하세요"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />

        <Input
          type="number"
          label="등번호"
          placeholder="등번호를 입력하세요"
          value={jerseyNumber}
          onChange={(e) => setJerseyNumber(e.target.value)}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">활동 상태</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="active">활동</option>
            <option value="injured">부상</option>
            <option value="long_term_absence">장기 출전 불가</option>
            <option value="short_term_absence">단기 출전 불가</option>
          </select>
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
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
            추가하기
          </Button>
        </div>
      </form>
    </Modal>
  );
}

