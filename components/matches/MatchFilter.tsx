'use client';

import { useState, useEffect } from 'react';

interface MatchFilterProps {
  onFilterChange: (year: number | null, month: number | null) => void;
  initialYear?: number | null;
  initialMonth?: number | null;
}

export default function MatchFilter({ onFilterChange, initialYear, initialMonth }: MatchFilterProps) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [year, setYear] = useState<number | null>(initialYear ?? currentYear);
  const [month, setMonth] = useState<number | null>(initialMonth ?? currentMonth);
  const [showAll, setShowAll] = useState(false);

  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // 부모로부터 받은 초기값이 변경되면 동기화
  useEffect(() => {
    if (initialYear !== undefined) {
      setYear(initialYear);
    }
    if (initialMonth !== undefined) {
      setMonth(initialMonth);
    }
  }, [initialYear, initialMonth]);

  // year, month, showAll이 변경될 때마다 부모에게 알림
  useEffect(() => {
    if (showAll) {
      onFilterChange(null, null);
    } else {
      onFilterChange(year, month);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month, showAll]); // onFilterChange는 의존성에서 제외 (무한 루프 방지)

  const handleShowAllToggle = () => {
    const newShowAll = !showAll;
    setShowAll(newShowAll);
    if (newShowAll) {
      onFilterChange(null, null);
    } else {
      onFilterChange(year || currentYear, month || currentMonth);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="show-all"
          checked={showAll}
          onChange={handleShowAllToggle}
          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
        />
        <label htmlFor="show-all" className="text-sm font-medium text-gray-700 cursor-pointer">
          전체 조회
        </label>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">연도</label>
          <select
            value={year || ''}
            onChange={(e) => {
              const newYear = e.target.value ? Number(e.target.value) : null;
              setYear(newYear);
              setShowAll(false);
            }}
            disabled={showAll}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}년
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">월</label>
          <select
            value={month || ''}
            onChange={(e) => {
              const newMonth = e.target.value ? Number(e.target.value) : null;
              setMonth(newMonth);
              setShowAll(false);
            }}
            disabled={showAll}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m}월
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

