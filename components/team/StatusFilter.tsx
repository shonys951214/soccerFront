'use client';

type Status = 'active' | 'injured' | 'long_term_absence' | 'short_term_absence';

interface StatusFilterProps {
  selectedStatus: Status | 'all';
  onChange: (status: Status | 'all') => void;
}

const statuses: { value: Status | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'active', label: '활동' },
  { value: 'injured', label: '부상' },
  { value: 'long_term_absence', label: '장기 출전 불가' },
  { value: 'short_term_absence', label: '단기 출전 불가' },
];

export default function StatusFilter({
  selectedStatus,
  onChange,
}: StatusFilterProps) {
  return (
    <div className="flex gap-2">
      {statuses.map((status) => (
        <button
          key={status.value}
          type="button"
          onClick={() => onChange(status.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedStatus === status.value
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {status.label}
        </button>
      ))}
    </div>
  );
}

