import { ReactNode } from 'react';
import Loading from './Loading';

interface PageLayoutProps {
  isLoading?: boolean;
  error?: string;
  children?: ReactNode;
  className?: string;
}

export default function PageLayout({ isLoading, error, children, className = '' }: PageLayoutProps) {
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Loading size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return <div className={className}>{children}</div>;
}

