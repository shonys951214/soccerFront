'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import Link from 'next/link';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">조기축구 팀 관리</h1>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {user && (
              <>
                <Link
                  href="/dashboard/my-page"
                  className="flex items-center space-x-2 px-2 sm:px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
                >
                  <img
                    src={user.profileImage || '/profile_default_image.png'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-gray-300 group-hover:border-gray-400 transition-colors"
                  />
                  <span className="hidden sm:inline text-sm text-gray-700 group-hover:text-gray-900 font-medium transition-colors">
                    {user.name}님
                  </span>
                </Link>
              </>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">로그아웃</span>
              <span className="sm:hidden">로그아웃</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

