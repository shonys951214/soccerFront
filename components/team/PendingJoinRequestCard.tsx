'use client';

import { useState } from 'react';
import { JoinRequest } from '@/lib/types/team.types';
import { teamsApi } from '@/lib/api/teams.api';
import Button from '@/components/common/Button';
import { getErrorMessage } from '@/lib/utils/error';
import { formatDateLocale } from '@/lib/utils/format';

interface PendingJoinRequestCardProps {
  request: JoinRequest;
  onCancel: () => void;
}

export default function PendingJoinRequestCard({ request, onCancel }: PendingJoinRequestCardProps) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState('');

  const handleCancel = async () => {
    if (!confirm('가입신청을 취소하시겠습니까?')) {
      return;
    }

    setIsCancelling(true);
    setError('');
    try {
      await teamsApi.cancelJoinRequest(request.id);
      onCancel();
    } catch (err) {
      setError(getErrorMessage(err, '가입신청 취소에 실패했습니다.'));
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              가입신청 대기중
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">{request.teamName}</h3>
          <p className="text-xs sm:text-sm text-gray-600">
            신청일: {formatDateLocale(request.createdAt)}
          </p>
          {error && (
            <p className="text-red-600 text-xs mt-2">{error}</p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCancel}
          isLoading={isCancelling}
          disabled={isCancelling}
          className="text-red-600 border-red-300 hover:bg-red-50 w-full sm:w-auto"
        >
          신청 취소
        </Button>
      </div>
    </div>
  );
}

