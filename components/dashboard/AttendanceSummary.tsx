'use client';

import { AttendanceSummary as AttendanceSummaryType } from '@/lib/types/dashboard.types';

interface AttendanceSummaryProps {
  attendance?: AttendanceSummaryType;
}

export default function AttendanceSummary({ attendance }: AttendanceSummaryProps) {
  if (!attendance) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">출석관리</h2>
        <p className="text-gray-500">출석 데이터가 없습니다.</p>
      </div>
    );
  }

  const total = attendance.attending + attendance.late + attendance.absent;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">출석관리</h2>
      <div className="grid grid-cols-3 gap-4">
        <AttendanceItem
          label="참석"
          value={attendance.attending}
          total={total}
          color="green"
        />
        <AttendanceItem
          label="지각"
          value={attendance.late}
          total={total}
          color="yellow"
        />
        <AttendanceItem
          label="무단 불참"
          value={attendance.absent}
          total={total}
          color="red"
        />
      </div>
    </div>
  );
}

function AttendanceItem({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: 'green' | 'yellow' | 'red';
}) {
  const colorClasses = {
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
  };

  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';

  return (
    <div className={`p-4 rounded-lg ${colorClasses[color]}`}>
      <p className="text-sm font-medium mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs mt-1">{percentage}%</p>
    </div>
  );
}

