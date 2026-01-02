'use client';

import { useEffect, useState } from 'react';
import { teamsApi } from '@/lib/api/teams.api';
import { TeamMember, UserTeam } from '@/lib/types/team.types';
import { Position } from '@/lib/types/user.types';
import TeamStatsHeader from './TeamStatsHeader';
import PositionFilter from './PositionFilter';
import StatusFilter from './StatusFilter';
import MemberCard from './MemberCard';
import MemberDetailModal from './MemberDetailModal';
import InviteLinkModal from './InviteLinkModal';
import AddMemberModal from './AddMemberModal';
import Button from '@/components/common/Button';
import Loading from '@/components/common/Loading';

interface TeamMembersProps {
  teamId: string;
  canManage?: boolean;
}

export default function TeamMembers({ teamId, canManage = false }: TeamMembersProps) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [userTeam, setUserTeam] = useState<UserTeam | null>(null);
  const [selectedPositions, setSelectedPositions] = useState<Position[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<
    'active' | 'injured' | 'long_term_absence' | 'short_term_absence' | 'all'
  >('all');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersData, statsData, userTeamData] = await Promise.all([
          teamsApi.getTeamMembers(teamId),
          teamsApi.getTeamStats(teamId),
          teamsApi.getMyTeam().catch(() => null), // 실패해도 계속 진행
        ]);
        setMembers(membersData);
        setStats(statsData);
        setUserTeam(userTeamData);
      } catch (err: any) {
        setError('팀 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    if (teamId) {
      fetchData();
    }
  }, [teamId]);

  const filteredMembers = members.filter((member) => {
    // 포지션 필터
    if (selectedPositions.length > 0) {
      if (!member.positions || member.positions.length === 0) {
        return false;
      }
      // 선택된 포지션 중 하나라도 멤버의 포지션에 포함되어 있으면 통과
      const hasMatchingPosition = selectedPositions.some((pos) =>
        member.positions?.includes(pos)
      );
      if (!hasMatchingPosition) {
        return false;
      }
    }

    // 상태 필터
    if (selectedStatus !== 'all' && member.status !== selectedStatus) {
      return false;
    }

    return true;
  });

  const handleMemberClick = (member: TeamMember) => {
    setSelectedMember(member);
  };

  if (isLoading) {
    return <Loading size="lg" className="py-12" />;
  }

  if (error) {
    return <div className="text-red-600 text-center py-8">{error}</div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <TeamStatsHeader stats={stats} />

      {/* 상단 버튼 */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <Button variant="primary" onClick={() => setIsInviteModalOpen(true)} className="w-full sm:w-auto">
            초대 링크
          </Button>
          {canManage && (
            <Button variant="outline" onClick={() => setIsAddMemberModalOpen(true)} className="w-full sm:w-auto">
              선수 등록
            </Button>
          )}
        </div>
      </div>

      {/* 필터 */}
      <div className="space-y-3 sm:space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">포지션</label>
          <PositionFilter
            selectedPositions={selectedPositions}
            onChange={setSelectedPositions}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">활동 상태</label>
          <StatusFilter selectedStatus={selectedStatus} onChange={setSelectedStatus} />
        </div>
      </div>

      {/* 선수 목록 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredMembers.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            조건에 맞는 선수가 없습니다.
          </div>
        ) : (
          filteredMembers.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onClick={() => handleMemberClick(member)}
            />
          ))
        )}
      </div>

      {/* 모달 */}
      {selectedMember && (
        <MemberDetailModal
          isOpen={!!selectedMember}
          onClose={() => setSelectedMember(null)}
          member={selectedMember}
          teamId={teamId}
        />
      )}

      <InviteLinkModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        teamId={teamId}
      />

      {canManage && (
        <AddMemberModal
          isOpen={isAddMemberModalOpen}
          onClose={() => setIsAddMemberModalOpen(false)}
          teamId={teamId}
          onSuccess={async () => {
            // 목록 새로고침
            const membersData = await teamsApi.getTeamMembers(teamId);
            setMembers(membersData);
            setIsAddMemberModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

