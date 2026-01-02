import { TeamDetail, UserTeam } from '@/lib/types/team.types';
import { formatCreatedDate } from '@/lib/utils/format';
import Button from '@/components/common/Button';

interface TeamInfoCardProps {
  team: TeamDetail;
  userTeam: UserTeam | null;
  isUploadingLogo: boolean;
  onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLeaveTeam?: () => void;
  onDeleteTeam?: () => void;
  isLeaving?: boolean;
  isDeleting?: boolean;
}

export default function TeamInfoCard({
  team,
  userTeam,
  isUploadingLogo,
  onLogoChange,
  onLeaveTeam,
  onDeleteTeam,
  isLeaving = false,
  isDeleting = false,
}: TeamInfoCardProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-0">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">우리 팀 소개</h1>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* 팀 로고/사진 */}
        <div className="relative w-full h-48 sm:h-64 bg-gray-200 flex items-center justify-center">
          {team.logo ? (
            <img
              src={team.logo}
              alt={team.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-400 text-4xl sm:text-6xl">⚽</div>
          )}
          {isUploadingLogo && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}
          {/* 팀장만 로고 변경 버튼 표시 */}
          {userTeam && userTeam.role === 'captain' && (
            <div className="absolute bottom-4 right-4">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={onLogoChange}
                  disabled={isUploadingLogo}
                  className="hidden"
                  id="team-logo-input"
                />
                <Button
                  variant="primary"
                  size="sm"
                  disabled={isUploadingLogo}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    document.getElementById('team-logo-input')?.click();
                  }}
                >
                  {isUploadingLogo ? '업로드 중...' : '로고 변경'}
                </Button>
              </label>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
          {/* 팀명 */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{team.name}</h2>
          </div>

          {/* 지역 정보 */}
          {team.region && (
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">지역</h3>
              <p className="text-base sm:text-lg text-gray-900">{team.region}</p>
            </div>
          )}

          {/* 팀 설명 */}
          {team.description && (
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">팀 소개</h3>
              <p className="text-sm sm:text-base text-gray-900 whitespace-pre-wrap break-words">{team.description}</p>
            </div>
          )}

          {/* 팀장 정보 */}
          {team.captain && (
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">팀장</h3>
              <p className="text-base sm:text-lg text-gray-900">{team.captain.name}</p>
            </div>
          )}

          {/* 팀 시작일 */}
          <div>
            <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">팀 시작일</h3>
            <p className="text-base sm:text-lg text-gray-900">{formatCreatedDate(team.createdAt)}</p>
          </div>

          {/* 팀 관리 버튼 */}
          {userTeam && (
            <div className="pt-4 border-t border-gray-200">
              {userTeam.role === 'captain' ? (
                <Button
                  variant="danger"
                  size="md"
                  className="w-full"
                  onClick={onDeleteTeam}
                  isLoading={isDeleting}
                >
                  팀 삭제
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="md"
                  className="w-full text-red-600 border-red-300 hover:bg-red-50"
                  onClick={onLeaveTeam}
                  isLoading={isLeaving}
                >
                  팀 탈퇴
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

