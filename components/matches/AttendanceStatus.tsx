'use client';

import { MatchAttendance } from '@/lib/types/match.types';

interface AttendanceStatusProps {
  attendances: MatchAttendance[];
}

export default function AttendanceStatus({ attendances }: AttendanceStatusProps) {
  const attending = attendances.filter((a) => a.status === 'attending');
  const notAttending = attendances.filter((a) => a.status === 'not_attending');
  const maybe = attendances.filter((a) => a.status === 'maybe');
  const late = attendances.filter((a) => a.status === 'late');
  const absent = attendances.filter((a) => a.status === 'absent');

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">참석 현황</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatusItem label="참석" count={attending.length} color="green" />
        <StatusItem label="미정" count={maybe.length} color="yellow" />
        <StatusItem label="불참" count={notAttending.length} color="red" />
        <StatusItem label="지각" count={late.length} color="orange" />
        <StatusItem label="무단 불참" count={absent.length} color="red" />
      </div>

      {attending.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-2">참석 인원</p>
          <div className="flex flex-wrap gap-2">
            {attending.map((attendance) => (
              <span
                key={attendance.id}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
                {attendance.userName}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatusItem({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: 'green' | 'yellow' | 'red' | 'orange';
}) {
  const colorClasses = {
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
    orange: 'bg-orange-100 text-orange-800',
  };

  return (
    <div className={`p-3 rounded-lg text-center ${colorClasses[color]}`}>
      <p className="text-sm font-medium mb-1">{label}</p>
      <p className="text-2xl font-bold">{count}</p>
    </div>
  );
}

