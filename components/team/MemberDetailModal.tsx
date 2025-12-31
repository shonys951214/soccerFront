'use client';

import { useEffect, useState } from 'react';
import Modal from '@/components/common/Modal';
import Loading from '@/components/common/Loading';
import { TeamMember } from '@/lib/types/team.types';
import { teamsApi } from '@/lib/api/teams.api';

interface MemberDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: TeamMember;
  teamId: string;
}

export default function MemberDetailModal({
  isOpen,
  onClose,
  member,
  teamId,
}: MemberDetailModalProps) {
  const [memberDetail, setMemberDetail] = useState<TeamMember | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && member.id) {
      fetchMemberDetail();
    }
  }, [isOpen, member.id]);

  const fetchMemberDetail = async () => {
    setIsLoading(true);
    try {
      const data = await teamsApi.getTeamMember(teamId, member.id);
      setMemberDetail(data);
    } catch (error) {
      console.error('Failed to fetch member detail:', error);
      setMemberDetail(member); // 실패 시 기본 정보 사용
    } finally {
      setIsLoading(false);
    }
  };

  const displayMember = memberDetail || member;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="선수 상세" size="lg">
      {isLoading ? (
        <Loading size="md" />
      ) : (
        <div className="space-y-6">
          {/* 기본 정보 */}
          <div>
            <h3 className="text-md font-semibold text-gray-900 mb-3">기본 정보</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">이름</p>
                <p className="text-base font-medium text-gray-900">
                  {displayMember.name || '이름 없음'}
                </p>
              </div>
              {displayMember.jerseyNumber && (
                <div>
                  <p className="text-sm text-gray-600">등번호</p>
                  <p className="text-base font-medium text-gray-900">#{displayMember.jerseyNumber}</p>
                </div>
              )}
              {displayMember.phone && (
                <div>
                  <p className="text-sm text-gray-600">연락처</p>
                  <p className="text-base font-medium text-gray-900">{displayMember.phone}</p>
                </div>
              )}
              {displayMember.birthdate && (
                <div>
                  <p className="text-sm text-gray-600">생년월일</p>
                  <p className="text-base font-medium text-gray-900">
                    {new Date(displayMember.birthdate).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              )}
              {displayMember.positions && displayMember.positions.length > 0 && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">포지션</p>
                  <p className="text-base font-medium text-gray-900">
                    {displayMember.positions.join(', ')}
                  </p>
                </div>
              )}
              {displayMember.summary && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">소개</p>
                  <p className="text-base font-medium text-gray-900">{displayMember.summary}</p>
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </Modal>
  );
}

