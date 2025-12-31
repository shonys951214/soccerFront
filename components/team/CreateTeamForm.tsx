'use client';

import { useState } from 'react';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

interface CreateTeamFormProps {
  onSubmit: (name: string) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function CreateTeamForm({
  onSubmit,
  onCancel,
  isLoading = false,
}: CreateTeamFormProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('클럽 이름을 입력해주세요.');
      return;
    }

    try {
      await onSubmit(name.trim());
    } catch (err: any) {
      setError(err.response?.data?.message || '클럽 생성에 실패했습니다.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        label="클럽 이름"
        placeholder="클럽 이름을 입력하세요"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        error={error}
      />

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
          생성하기
        </Button>
      </div>
    </form>
  );
}

