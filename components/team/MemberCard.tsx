'use client';

import { TeamMember } from '@/lib/types/team.types';
import { Position } from '@/lib/types/user.types';

interface MemberCardProps {
  member: TeamMember & { age?: number };
  onClick: () => void;
  onDelete?: () => void;
  canDelete?: boolean;
}

export default function MemberCard({
  member,
  onClick,
  onDelete,
  canDelete = false,
}: MemberCardProps) {
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '활동';
      case 'injured':
        return '부상';
      case 'long_term_absence':
        return '장기 출전 불가';
      case 'short_term_absence':
        return '단기 출전 불가';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50';
      case 'injured':
        return 'text-orange-600 bg-orange-50';
      case 'long_term_absence':
        return 'text-red-600 bg-red-50';
      case 'short_term_absence':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getPositionText = (positions?: Position[]) => {
    if (!positions || positions.length === 0) return '-';
    return positions.join(', ');
  };

  return (
    <div
      className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow cursor-pointer relative flex flex-col"
      onClick={onClick}
    >
      {/* 삭제 버튼 (우측 상단) */}
      {canDelete && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-2 right-2 text-red-600 hover:text-red-700 text-sm font-medium z-10"
        >
          삭제
        </button>
      )}
      
      <div className="flex-1">
        {/* 이름과 등번호 */}
        <div className="flex items-center gap-2 mb-3">
          {member.jerseyNumber && (
            <span className="text-lg font-bold text-gray-600">#{member.jerseyNumber}</span>
          )}
          <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">
            {member.name || member.userName || '이름 없음'}
          </h3>
        </div>

        {/* 역할 배지 */}
        {member.role && (
          <div className="mb-2">
            <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700">
              {member.role === 'captain' ? '팀장' : member.role === 'vice_captain' ? '부팀장' : '팀원'}
            </span>
          </div>
        )}

        {/* 상태 배지 */}
        <div className="mb-3">
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              member.status
            )}`}
          >
            {getStatusText(member.status)}
          </span>
        </div>

        {/* 포지션 */}
        {member.positions && member.positions.length > 0 && (
          <div className="mb-2">
            <p className="text-xs text-gray-500 mb-1">포지션</p>
            <p className="text-sm font-medium text-gray-900">{getPositionText(member.positions)}</p>
          </div>
        )}

        {/* 나이 */}
        {member.age && (
          <div className="mb-2">
            <p className="text-xs text-gray-500 mb-1">나이</p>
            <p className="text-sm font-medium text-gray-900">{member.age}세</p>
          </div>
        )}

        {/* 연락처 */}
        {member.phone && (
          <div>
            <p className="text-xs text-gray-500 mb-1">연락처</p>
            <p className="text-sm font-medium text-gray-900">{member.phone}</p>
          </div>
        )}
      </div>
    </div>
  );
}

