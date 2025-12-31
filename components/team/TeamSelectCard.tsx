'use client';

import Button from '@/components/common/Button';

interface TeamSelectCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export default function TeamSelectCard({
  title,
  description,
  icon,
  onClick,
}: TeamSelectCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full p-8 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all text-left"
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="text-4xl">{icon}</div>
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 text-center">{description}</p>
      </div>
    </button>
  );
}

