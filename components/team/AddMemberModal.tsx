'use client';

import { useState } from 'react';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import PositionSelector from '@/components/auth/PositionSelector';
import { Position } from '@/lib/types/user.types';
import { teamsApi } from '@/lib/api/teams.api';

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
  const [name, setName] = useState('');
  const [jerseyNumber, setJerseyNumber] = useState('');
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: 선수 등록 API 호출
      // await teamsApi.addMember(teamId, { name, jerseyNumber, positions });
      alert('선수 등록 기능은 추후 구현 예정입니다.');
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || '선수 등록에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="선수 등록" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          label="이름 *"
          placeholder="선수 이름을 입력하세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          type="number"
          label="등번호"
          placeholder="등번호를 입력하세요"
          value={jerseyNumber}
          onChange={(e) => setJerseyNumber(e.target.value)}
        />

        <PositionSelector selectedPositions={positions} onChange={setPositions} />

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
            등록하기
          </Button>
        </div>
      </form>
    </Modal>
  );
}

