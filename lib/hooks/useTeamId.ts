'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { getUserTeamId } from '@/lib/utils/team';

/**
 * 사용자의 실제 팀 ID를 가져오는 훅
 * 백엔드 API를 통해 실제 팀 멤버십을 확인합니다.
 * 
 * 주의: 자동 리다이렉트는 하지 않습니다. 
 * 팀이 없을 때의 처리는 상위 컴포넌트에서 처리해야 합니다.
 */
export function useTeamId() {
  const { user, isAuthenticated } = useAuth();
  const [teamId, setTeamId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeamId = async () => {
      // 인증되지 않았으면 대기
      if (!isAuthenticated || !user) {
        setIsLoading(false);
        return;
      }

      // 이전 팀 ID 확인 (추방 감지용)
      const storedTeamId = localStorage.getItem('teamId');
      const hasRemovedReason = localStorage.getItem('teamRemovedReason');

      try {
        // 백엔드 API를 통해 실제로 사용자가 속한 팀 ID 확인
        const userTeamId = await getUserTeamId();
        setTeamId(userTeamId);
        
        // 이전에 팀이 있었는데 지금 없고, 탈퇴 상태가 아니면 추방으로 간주
        if (!userTeamId && storedTeamId && !hasRemovedReason) {
          // 추방된 경우로 간주 (탈퇴는 이미 localStorage에 저장됨)
          localStorage.setItem('teamRemovedReason', 'expelled');
        }
        
        // 팀 ID가 변경되면 localStorage 업데이트
        if (userTeamId) {
          localStorage.setItem('teamId', userTeamId);
          // 팀이 다시 생기면 추방 상태 제거
          if (hasRemovedReason) {
            localStorage.removeItem('teamRemovedReason');
          }
        } else {
          localStorage.removeItem('teamId');
        }
      } catch (error) {
        console.error('Failed to get user team:', error);
        setTeamId(null);
        localStorage.removeItem('teamId');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamId();
  }, [user, isAuthenticated]);

  return { teamId, isLoading };
}

