import { ReactNode } from 'react';
import { useTeamId } from '@/lib/hooks/useTeamId';
import PageLayout from './PageLayout';

interface TeamRequiredWrapperProps {
  children: ReactNode;
}

export default function TeamRequiredWrapper({ children }: TeamRequiredWrapperProps) {
  const { teamId, isLoading } = useTeamId();

  if (isLoading) {
    return <PageLayout isLoading={true} />;
  }

  if (!teamId) {
    return (
      <PageLayout isLoading={false}>
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">팀에 가입되어 있지 않습니다.</p>
          <a
            href="/team-select"
            className="text-red-600 hover:text-red-700 underline"
          >
            클럽 생성 또는 가입하기
          </a>
        </div>
      </PageLayout>
    );
  }

  return <>{children}</>;
}

