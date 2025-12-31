'use client';

import { Position } from '@/lib/types/user.types';

interface PositionFilterProps {
  selectedPositions: Position[];
  onChange: (positions: Position[]) => void;
}

const positions: { value: Position; label: string }[] = [
  { value: 'GK', label: 'GK' },
  { value: 'DF', label: 'DF' },
  { value: 'MF', label: 'MF' },
  { value: 'FW', label: 'FW' },
];

export default function PositionFilter({
  selectedPositions,
  onChange,
}: PositionFilterProps) {
  const handleToggle = (position: Position) => {
    if (selectedPositions.includes(position)) {
      onChange(selectedPositions.filter((p) => p !== position));
    } else {
      onChange([...selectedPositions, position]);
    }
  };

  return (
    <div className="flex gap-2">
      {positions.map((pos) => (
        <button
          key={pos.value}
          type="button"
          onClick={() => handleToggle(pos.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedPositions.includes(pos.value)
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {pos.label}
        </button>
      ))}
    </div>
  );
}

