'use client';

import { Position } from '@/lib/types/user.types';

interface PositionSelectorProps {
  selectedPositions: Position[];
  onChange: (positions: Position[]) => void;
}

const positions: { value: Position; label: string }[] = [
  { value: 'GK', label: '골키퍼' },
  { value: 'DF', label: '수비수' },
  { value: 'MF', label: '미드필더' },
  { value: 'FW', label: '공격수' },
];

export default function PositionSelector({
  selectedPositions,
  onChange,
}: PositionSelectorProps) {
  const handleToggle = (position: Position) => {
    if (selectedPositions.includes(position)) {
      onChange(selectedPositions.filter((p) => p !== position));
    } else {
      onChange([...selectedPositions, position]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        포지션 (다중 선택 가능)
      </label>
      <div className="grid grid-cols-2 gap-2">
        {positions.map((pos) => (
          <button
            key={pos.value}
            type="button"
            onClick={() => handleToggle(pos.value)}
            className={`px-4 py-2 rounded-lg border-2 transition-colors ${
              selectedPositions.includes(pos.value)
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
            }`}
          >
            {pos.label}
          </button>
        ))}
      </div>
    </div>
  );
}

