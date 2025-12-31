'use client';

import { useEffect, useState } from 'react';
import { teamsApi } from '@/lib/api/teams.api';
import { TeamMember } from '@/lib/types/team.types';
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
        const [membersData, statsData] = await Promise.all([
          teamsApi.getTeamMembers(teamId),
          teamsApi.getTeamStats(teamId),
        ]);
        setMembers(membersData);
        setStats(statsData);
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

  const handleDelete = async (memberId: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    
    try {
      await teamsApi.deleteMember(teamId, memberId);
      // 목록 새로고침
      const membersData = await teamsApi.getTeamMembers(teamId);
      setMembers(membersData);
    } catch (err: any) {
      alert(err.response?.data?.message || '팀원 삭제에 실패했습니다.');
    }
  };

  if (isLoading) {
    return <Loading size="lg" className="py-12" />;
  }

  if (error) {
    return <div className="text-red-600 text-center py-8">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <TeamStatsHeader stats={stats} />

      {/* 상단 버튼 */}
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <Button variant="primary" onClick={() => setIsInviteModalOpen(true)}>
            초대 링크
          </Button>
          {canManage && (
            <Button variant="outline" onClick={() => setIsAddMemberModalOpen(true)}>
              선수 등록
            </Button>
          )}
        </div>
      </div>

      {/* 필터 */}
      <div className="space-y-4">
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
      <div className="space-y-3">
        {filteredMembers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            조건에 맞는 선수가 없습니다.
          </div>
        ) : (
          filteredMembers.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onClick={() => handleMemberClick(member)}
              onDelete={() => handleDelete(member.id)}
              canDelete={canManage}
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

