'use client';

import { useState, useEffect } from 'react';
import { teamsApi } from '@/lib/api/teams.api';
import { JoinRequest } from '@/lib/types/team.types';
import PendingJoinRequestCard from './PendingJoinRequestCard';
import Loading from '@/components/common/Loading';
import { getErrorMessage } from '@/lib/utils/error';

export default function PendingJoinRequestBanner() {
  const [pendingRequests, setPendingRequests] = useState<JoinRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPendingRequests = async () => {
    setIsLoading(true);
    setError('');
    try {
      const requests = await teamsApi.getMyJoinRequests();
      // pending 상태인 신청만 필터링
      setPendingRequests(requests.filter(req => req.status === 'pending'));
    } catch (err) {
      setError(getErrorMessage(err, '가입신청 정보를 불러오는데 실패했습니다.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const handleCancel = () => {
    fetchPendingRequests(); // 목록 새로고침
  };

  if (isLoading) {
    return (
      <div className="mb-4 sm:mb-6">
        <Loading size="sm" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-4 sm:mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
        {error}
      </div>
    );
  }

  if (pendingRequests.length === 0) {
    return (
      <div className="mb-4 sm:mb-6 p-4 sm:p-6 bg-gray-50 border border-gray-200 rounded-lg text-center">
        <p className="text-sm sm:text-base text-gray-600">
          현재 가입승인 대기중인 팀이 없습니다. 원하는 팀을 찾아보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-4 sm:mb-6 space-y-3">
      {pendingRequests.map((request) => (
        <PendingJoinRequestCard
          key={request.id}
          request={request}
          onCancel={handleCancel}
        />
      ))}
    </div>
  );
}

