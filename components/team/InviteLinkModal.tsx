'use client';

import { useState } from 'react';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import { teamsApi } from '@/lib/api/teams.api';
import Loading from '@/components/common/Loading';

interface InviteLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
}

export default function InviteLinkModal({
  isOpen,
  onClose,
  teamId,
}: InviteLinkModalProps) {
  const [link, setLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await teamsApi.createInviteLink(teamId);
      setLink(result.link);
    } catch (err: any) {
      setError('초대 링크 생성에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    alert('링크가 복사되었습니다.');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="초대 링크 생성" size="md">
      <div className="space-y-4">
        {!link ? (
          <>
            <p className="text-sm text-gray-600">
              초대 링크를 생성하면 다른 사용자가 이 링크를 통해 팀에 가입할 수 있습니다.
            </p>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <Button
              variant="primary"
              onClick={handleGenerate}
              isLoading={isLoading}
              className="w-full"
            >
              링크 생성하기
            </Button>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                초대 링크
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={link}
                  readOnly
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
                <Button variant="outline" onClick={handleCopy}>
                  복사
                </Button>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              이 링크를 공유하여 팀원을 초대하세요.
            </p>
          </>
        )}
      </div>
    </Modal>
  );
}

