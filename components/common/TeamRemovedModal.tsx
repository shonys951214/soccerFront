'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from './Button';

interface TeamRemovedModalProps {
  reason: 'left' | 'expelled';
  onClose: () => void;
}

export default function TeamRemovedModal({ reason, onClose }: TeamRemovedModalProps) {
  const router = useRouter();

  const handleConfirm = () => {
    // localStorage에서 상태 제거
    localStorage.removeItem('teamRemovedReason');
    localStorage.removeItem('teamId');
    onClose();
    router.push('/team-select');
  };

  const message = reason === 'left' 
    ? '팀에서 탈퇴되었습니다.'
    : '팀에서 추방되었습니다.';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">알림</h3>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end">
          <Button
            variant="primary"
            onClick={handleConfirm}
            className="min-w-24"
          >
            확인
          </Button>
        </div>
      </div>
    </div>
  );
}

