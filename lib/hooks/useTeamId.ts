'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { getUserTeamId } from '@/lib/utils/team';

/**
 * 사용자의 실제 팀 ID를 가져오는 훅
 * 백엔드 API를 통해 실제 팀 멤버십을 확인합니다.
 */
export function useTeamId() {
  const router = useRouter();
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

      try {
        // 백엔드 API를 통해 실제로 사용자가 속한 팀 ID 확인
        const userTeamId = await getUserTeamId();
        setTeamId(userTeamId);
        
        // 팀이 없으면 클럽 선택 페이지로 리다이렉트
        if (!userTeamId) {
          router.push('/team-select');
        }
      } catch (error) {
        console.error('Failed to get user team:', error);
        setTeamId(null);
        // 에러 발생 시에도 클럽 선택 페이지로 리다이렉트
        router.push('/team-select');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamId();
  }, [user, isAuthenticated, router]);

  return { teamId, isLoading };
}

