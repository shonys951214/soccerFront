'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { name: '요약', href: '/dashboard', icon: '📊' },
  { name: '경기', href: '/dashboard/matches', icon: '⚽' },
  { name: '개인', href: '/dashboard/rankings', icon: '🏆' },
  { name: '팀 구성', href: '/dashboard/team', icon: '👥' },
];

const rightTabs = [
  { name: 'My Team', href: '/dashboard/my-team', icon: '⚽' },
];

export default function TabNavigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              // 요약 탭(/dashboard)은 정확히 일치할 때만 활성화
              // 다른 탭들은 해당 경로로 시작할 때 활성화
              const isActive =
                tab.href === '/dashboard'
                  ? pathname === tab.href
                  : pathname === tab.href || pathname?.startsWith(tab.href + '/');
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`
                    flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${
                      isActive
                        ? 'border-red-600 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </Link>
              );
            })}
          </div>
          <div className="flex space-x-8">
            {rightTabs.map((tab) => {
              const isActive =
                pathname === tab.href || pathname?.startsWith(tab.href + '/');
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`
                    flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${
                      isActive
                        ? 'border-red-600 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

