'use client';

import { TeamMember } from '@/lib/types/team.types';
import { Position } from '@/lib/types/user.types';

interface MemberCardProps {
  member: TeamMember & { userName?: string; positions?: Position[]; age?: number; phone?: string };
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
      className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow cursor-pointer relative"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {member.jerseyNumber && (
              <span className="text-lg font-bold text-gray-600">#{member.jerseyNumber}</span>
            )}
            <h3 className="text-lg font-semibold text-gray-900">
              {member.userName || '이름 없음'}
            </h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                member.status
              )}`}
            >
              {getStatusText(member.status)}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {member.positions && (
              <span>포지션: {getPositionText(member.positions)}</span>
            )}
            {member.age && <span>나이: {member.age}세</span>}
            {member.phone && <span>연락처: {member.phone}</span>}
          </div>
        </div>
        {canDelete && onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="ml-4 text-red-600 hover:text-red-700"
          >
            삭제
          </button>
        )}
      </div>
    </div>
  );
}

