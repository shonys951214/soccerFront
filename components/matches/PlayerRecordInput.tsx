'use client';

import { PlayerRecord } from '@/lib/types/match.types';
import Input from '@/components/common/Input';

interface PlayerRecordInputProps {
  player: {
    id: string;
    name: string;
  };
  record: PlayerRecord;
  onChange: (record: PlayerRecord) => void;
}

export default function PlayerRecordInput({
  player,
  record,
  onChange,
}: PlayerRecordInputProps) {
  return (
    <div className="p-4 border border-gray-200 rounded-lg space-y-3">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={record.played}
            onChange={(e) =>
              onChange({ ...record, played: e.target.checked })
            }
            className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
          />
          <span className="font-medium text-gray-900">{player.name}</span>
        </label>
      </div>

      {record.played && (
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="number"
            label="득점"
            min="0"
            value={record.goals}
            onChange={(e) =>
              onChange({ ...record, goals: parseInt(e.target.value) || 0 })
            }
          />
          <Input
            type="number"
            label="도움"
            min="0"
            value={record.assists}
            onChange={(e) =>
              onChange({ ...record, assists: parseInt(e.target.value) || 0 })
            }
          />
        </div>
      )}
    </div>
  );
}

