'use client';

import { GameRecord } from '@/lib/types/match.types';
import Input from '@/components/common/Input';

interface GameScoreInputProps {
  gameNumber: number;
  game: GameRecord;
  onChange: (game: GameRecord) => void;
}

export default function GameScoreInput({
  gameNumber,
  game,
  onChange,
}: GameScoreInputProps) {
  const calculateResult = (ourScore: number, opponentScore: number) => {
    if (ourScore > opponentScore) return '승';
    if (ourScore < opponentScore) return '패';
    return '무';
  };

  const result = calculateResult(game.ourScore, game.opponentScore);
  const resultColor =
    result === '승'
      ? 'text-green-600'
      : result === '패'
      ? 'text-red-600'
      : 'text-gray-600';

  return (
    <div className="p-4 border border-gray-200 rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-900">게임 {gameNumber}</h4>
        <span className={`font-bold ${resultColor}`}>{result}</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="number"
          label="우리팀 점수"
          min="0"
          value={game.ourScore}
          onChange={(e) =>
            onChange({ ...game, ourScore: parseInt(e.target.value) || 0 })
          }
        />
        <Input
          type="number"
          label="상대팀 점수"
          min="0"
          value={game.opponentScore}
          onChange={(e) =>
            onChange({
              ...game,
              opponentScore: parseInt(e.target.value) || 0,
            })
          }
        />
      </div>
    </div>
  );
}

