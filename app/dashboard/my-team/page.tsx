'use client';

import { useState } from 'react';
import { useTeamId } from '@/lib/hooks/useTeamId';
import { useTeamData } from '@/lib/hooks/useTeamData';
import { useTeamActions } from '@/lib/hooks/useTeamActions';
import TeamRequiredWrapper from '@/components/common/TeamRequiredWrapper';
import PageLayout from '@/components/common/PageLayout';
import TeamInfoCard from '@/components/team/TeamInfoCard';
import TeamModals from '@/components/team/TeamModals';
import JoinRequestManagement from '@/components/team/JoinRequestManagement';

type TabType = 'info' | 'approval';

export default function MyTeamPage() {
  const { teamId } = useTeamId();
  const { team, userTeam, isLoading, error, refreshTeam } = useTeamData(teamId);
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const {
    isLeaving,
    isDeleting,
    isUploadingLogo,
    showLeaveModal,
    showDeleteModal,
    leaveConfirmText,
    deleteConfirmText,
    leaveErrorMessage,
    deleteErrorMessage,
    uploadErrorMessage,
    setShowLeaveModal,
    setShowDeleteModal,
    setLeaveConfirmText,
    setDeleteConfirmText,
    handleLeaveTeam,
    handleConfirmLeave,
    handleDeleteTeam,
    handleConfirmDelete,
    handleLogoChange,
  } = useTeamActions(teamId);

  const canManageApprovals = userTeam && (userTeam.role === 'captain' || userTeam.role === 'vice_captain');

  if (isLoading) {
    return <PageLayout isLoading={true} />;
  }

  if (error) {
    return <PageLayout error={error} />;
  }

  if (!team) {
    return null;
  }

  return (
    <TeamRequiredWrapper>
      <div className="max-w-4xl mx-auto px-4 sm:px-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">우리 팀 소개</h1>

        {/* 탭 네비게이션 */}
        {canManageApprovals && (
          <div className="mb-6 border-b border-gray-200">
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveTab('info')}
                className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'info'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                팀 정보
              </button>
              <button
                onClick={() => setActiveTab('approval')}
                className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'approval'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                가입승인관리
              </button>
            </nav>
          </div>
        )}

        {/* 탭 컨텐츠 */}
        {activeTab === 'info' ? (
          <>
            <TeamInfoCard
              team={team}
              userTeam={userTeam}
              isUploadingLogo={isUploadingLogo}
              onLogoChange={(e) => handleLogoChange(e, refreshTeam)}
              onLeaveTeam={handleLeaveTeam}
              onDeleteTeam={handleDeleteTeam}
              isLeaving={isLeaving}
              isDeleting={isDeleting}
            />

            {uploadErrorMessage && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {uploadErrorMessage}
              </div>
            )}

            <TeamModals
              showLeaveModal={showLeaveModal}
              showDeleteModal={showDeleteModal}
              leaveConfirmText={leaveConfirmText}
              deleteConfirmText={deleteConfirmText}
              leaveErrorMessage={leaveErrorMessage}
              deleteErrorMessage={deleteErrorMessage}
              isLeaving={isLeaving}
              isDeleting={isDeleting}
              onCloseLeaveModal={() => {
                setShowLeaveModal(false);
                setLeaveConfirmText('');
              }}
              onCloseDeleteModal={() => {
                setShowDeleteModal(false);
                setDeleteConfirmText('');
              }}
              setLeaveConfirmText={setLeaveConfirmText}
              setDeleteConfirmText={setDeleteConfirmText}
              onConfirmLeave={handleConfirmLeave}
              onConfirmDelete={handleConfirmDelete}
            />
          </>
        ) : (
          teamId && <JoinRequestManagement teamId={teamId} />
        )}
      </div>
    </TeamRequiredWrapper>
  );
}

