'use client';

import Modal from '@/components/common/Modal';
import { TeamMember } from '@/lib/types/team.types';

interface MemberDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: TeamMember & {
    userName?: string;
    personalRecords?: any[];
  };
}

export default function MemberDetailModal({
  isOpen,
  onClose,
  member,
}: MemberDetailModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="선수 상세" size="lg">
      <div className="space-y-6">
        {/* 기본 정보 */}
        <div>
          <h3 className="text-md font-semibold text-gray-900 mb-3">기본 정보</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">이름</p>
              <p className="text-base font-medium text-gray-900">
                {member.userName || '이름 없음'}
              </p>
            </div>
            {member.jerseyNumber && (
              <div>
                <p className="text-sm text-gray-600">등번호</p>
                <p className="text-base font-medium text-gray-900">#{member.jerseyNumber}</p>
              </div>
            )}
          </div>
        </div>

        {/* 개인 기록 */}
        <div>
          <h3 className="text-md font-semibold text-gray-900 mb-3">개인 기록</h3>
          {member.personalRecords && member.personalRecords.length > 0 ? (
            <div className="space-y-2">
              {member.personalRecords.map((record, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 rounded border border-gray-200"
                >
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium text-gray-900">{record.date}</p>
                      <p className="text-gray-600">vs {record.opponentTeam}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600">출전: {record.gamesPlayed}게임</p>
                      <p className="text-gray-600">득점: {record.goals}골</p>
                      <p className="text-gray-600">도움: {record.assists}개</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">기록이 없습니다.</p>
          )}
        </div>
      </div>
    </Modal>
  );
}

