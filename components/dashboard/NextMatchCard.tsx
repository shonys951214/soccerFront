'use client';

import { NextMatch } from '@/lib/types/dashboard.types';

interface NextMatchCardProps {
  match?: NextMatch;
}

export default function NextMatchCard({ match }: NextMatchCardProps) {
  if (!match) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">다음 경기</h2>
        <p className="text-gray-500">예정된 경기가 없습니다.</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    return `${date.getMonth() + 1}/${date.getDate()} (${weekdays[date.getDay()]})`;
  };

  const getAttendanceStatusText = (status?: string) => {
    switch (status) {
      case 'attending':
        return '참석';
      case 'not_attending':
        return '불참';
      case 'maybe':
        return '미정';
      default:
        return '미투표';
    }
  };

  const getAttendanceStatusColor = (status?: string) => {
    switch (status) {
      case 'attending':
        return 'text-green-600 bg-green-50';
      case 'not_attending':
        return 'text-red-600 bg-red-50';
      case 'maybe':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">다음 경기</h2>
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-600">날짜</p>
          <p className="text-base font-medium text-gray-900">{formatDate(match.date)}</p>
        </div>
        {match.time && (
          <div>
            <p className="text-sm text-gray-600">시간</p>
            <p className="text-base font-medium text-gray-900">{match.time}</p>
          </div>
        )}
        <div>
          <p className="text-sm text-gray-600">상대팀</p>
          <p className="text-base font-medium text-gray-900">{match.opponentTeamName}</p>
        </div>
        {match.location && (
          <div>
            <p className="text-sm text-gray-600">장소</p>
            <p className="text-base font-medium text-gray-900">{match.location}</p>
          </div>
        )}
        <div>
          <p className="text-sm text-gray-600 mb-1">내 참석 상태</p>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getAttendanceStatusColor(
              match.myAttendanceStatus
            )}`}
          >
            {getAttendanceStatusText(match.myAttendanceStatus)}
          </span>
        </div>
      </div>
    </div>
  );
}

