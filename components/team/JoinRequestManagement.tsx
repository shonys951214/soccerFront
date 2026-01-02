'use client';

import { useState, useEffect } from 'react';
import { teamsApi } from '@/lib/api/teams.api';
import { JoinRequest } from '@/lib/types/team.types';
import Button from '@/components/common/Button';
import Loading from '@/components/common/Loading';
import { getErrorMessage } from '@/lib/utils/error';

interface JoinRequestManagementProps {
  teamId: string;
}

export default function JoinRequestManagement({ teamId }: JoinRequestManagementProps) {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchJoinRequests();
  }, [teamId]);

  const fetchJoinRequests = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await teamsApi.getJoinRequests(teamId);
      // pending 상태만 필터링
      const pendingRequests = data.filter(req => req.status === 'pending');
      setRequests(pendingRequests);
    } catch (err) {
      setError(getErrorMessage(err, '가입신청 목록을 불러오는데 실패했습니다.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleReview = async (requestId: string, status: 'approved' | 'rejected') => {
    setProcessingId(requestId);
    try {
      await teamsApi.reviewJoinRequest(teamId, requestId, status);
      // 목록 새로고침
      await fetchJoinRequests();
      alert(status === 'approved' ? '가입신청을 승인했습니다.' : '가입신청을 거절했습니다.');
    } catch (err) {
      const errorMessage = getErrorMessage(err, '처리 중 오류가 발생했습니다.');
      alert(errorMessage);
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  if (isLoading) {
    return <Loading size="lg" className="py-8" />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
        가입 대기 중인 신청이 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">가입 대기 중 ({requests.length})</h3>
      <div className="space-y-3">
        {requests.map((request) => (
          <div
            key={request.id}
            className="bg-white rounded-lg shadow p-4 sm:p-6 border border-gray-200"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                    {request.userName}
                  </h4>
                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                    대기중
                  </span>
                </div>
                
                {request.positions && request.positions.length > 0 && (
                  <p className="text-sm text-gray-600 mb-1">
                    포지션: {request.positions.join(', ')}
                  </p>
                )}
                
                {request.phone && (
                  <p className="text-sm text-gray-600 mb-1">
                    연락처: {request.phone}
                  </p>
                )}
                
                {request.birthdate && (
                  <p className="text-sm text-gray-600 mb-1">
                    생년월일: {new Date(request.birthdate).toLocaleDateString('ko-KR')}
                  </p>
                )}
                
                {request.summary && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {request.summary}
                  </p>
                )}
                
                {request.message && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700">
                    <span className="font-medium">신청 메시지:</span> {request.message}
                  </div>
                )}
                
                <p className="text-xs text-gray-500 mt-2">
                  신청일: {formatDate(request.createdAt)}
                </p>
              </div>
              
              <div className="flex gap-2 sm:flex-col sm:gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleReview(request.id, 'approved')}
                  isLoading={processingId === request.id}
                  disabled={processingId !== null}
                  className="flex-1 sm:flex-none"
                >
                  수락
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReview(request.id, 'rejected')}
                  isLoading={processingId === request.id}
                  disabled={processingId !== null}
                  className="flex-1 sm:flex-none"
                >
                  거절
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

