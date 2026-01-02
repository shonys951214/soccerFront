'use client';

import { useState, useEffect } from 'react';
import { matchesApi } from '@/lib/api/matches.api';
import { MatchAttendance } from '@/lib/types/match.types';
import Button from '@/components/common/Button';

interface AttendanceVoteProps {
  matchId: string;
  currentStatus?: 'attending' | 'not_attending' | 'maybe';
  onVoteSuccess?: () => void;
}

export default function AttendanceVote({
  matchId,
  currentStatus,
  onVoteSuccess,
}: AttendanceVoteProps) {
  const [selectedStatus, setSelectedStatus] = useState<
    'attending' | 'not_attending' | 'maybe' | null
  >(currentStatus || null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVote = async (status: 'attending' | 'not_attending' | 'maybe') => {
    setIsLoading(true);
    try {
      await matchesApi.voteAttendance(matchId, { status });
      setSelectedStatus(status);
      // 투표 완료 플래그 설정 (요약탭 새로고침용)
      localStorage.setItem('attendanceVoted', Date.now().toString());
      // Custom Event 발생 (요약탭에서 즉시 감지)
      window.dispatchEvent(new CustomEvent('attendanceVoted', { detail: { matchId, status } }));
      onVoteSuccess?.();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || '투표에 실패했습니다.';
      alert(errorMessage);
      console.error('Attendance vote error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'attending':
        return '참석';
      case 'not_attending':
        return '불참';
      case 'maybe':
        return '미정';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">참석 투표</h3>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <Button
          variant={selectedStatus === 'attending' ? 'primary' : 'outline'}
          onClick={() => handleVote('attending')}
          disabled={isLoading}
          className="flex-1"
        >
          참석
        </Button>
        <Button
          variant={selectedStatus === 'maybe' ? 'primary' : 'outline'}
          onClick={() => handleVote('maybe')}
          disabled={isLoading}
          className="flex-1"
        >
          미정
        </Button>
        <Button
          variant={selectedStatus === 'not_attending' ? 'primary' : 'outline'}
          onClick={() => handleVote('not_attending')}
          disabled={isLoading}
          className="flex-1"
        >
          불참
        </Button>
      </div>
      {selectedStatus && (
        <p className="mt-3 text-sm text-gray-600 text-center">
          현재 선택: <span className="font-semibold">{getStatusText(selectedStatus)}</span>
        </p>
      )}
    </div>
  );
}

