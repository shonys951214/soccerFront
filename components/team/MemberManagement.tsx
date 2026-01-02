'use client';

import { useState, useEffect } from 'react';
import { teamsApi } from '@/lib/api/teams.api';
import { TeamMember, UserTeam } from '@/lib/types/team.types';
import Button from '@/components/common/Button';
import Loading from '@/components/common/Loading';
import { getErrorMessage } from '@/lib/utils/error';

interface MemberManagementProps {
  teamId: string;
  userTeam: UserTeam | null;
}

export default function MemberManagement({ teamId, userTeam }: MemberManagementProps) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const isCaptain = userTeam?.role === 'captain';

  useEffect(() => {
    if (teamId && isCaptain) {
      fetchMembers();
    }
  }, [teamId, isCaptain]);

  const fetchMembers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await teamsApi.getTeamMembers(teamId);
      setMembers(data);
    } catch (err) {
      setError(getErrorMessage(err, '팀원 목록을 불러오는데 실패했습니다.'));
    } finally {
      setIsLoading(false);
    }
  };

  // 부팀장 수 확인
  const viceCaptainCount = members.filter(m => m.role === 'vice_captain').length;
  const canAppointViceCaptain = viceCaptainCount < 2;

  const handleAppointViceCaptain = async (memberId: string) => {
    if (!canAppointViceCaptain) {
      alert('부팀장은 최대 2명까지 임명할 수 있습니다.');
      return;
    }

    if (!confirm('이 팀원을 부팀장으로 임명하시겠습니까?')) {
      return;
    }

    setProcessingId(memberId);
    try {
      await teamsApi.updateMember(teamId, memberId, { role: 'vice_captain' });
      await fetchMembers();
      alert('부팀장으로 임명되었습니다.');
    } catch (err) {
      const errorMessage = getErrorMessage(err, '부팀장 임명에 실패했습니다.');
      alert(errorMessage);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRemoveViceCaptain = async (memberId: string) => {
    if (!confirm('부팀장 권한을 해제하시겠습니까?')) {
      return;
    }

    setProcessingId(memberId);
    try {
      await teamsApi.updateMember(teamId, memberId, { role: 'member' });
      await fetchMembers();
      alert('부팀장 권한이 해제되었습니다.');
    } catch (err) {
      const errorMessage = getErrorMessage(err, '부팀장 해제에 실패했습니다.');
      alert(errorMessage);
    } finally {
      setProcessingId(null);
    }
  };

  const handleChangeViceCaptain = async (oldViceCaptainId: string, newMemberId: string) => {
    if (!confirm('부팀장을 변경하시겠습니까? 기존 부팀장은 일반 팀원으로 변경됩니다.')) {
      return;
    }

    setProcessingId(newMemberId);
    try {
      // 기존 부팀장 해제
      await teamsApi.updateMember(teamId, oldViceCaptainId, { role: 'member' });
      // 새 부팀장 임명
      await teamsApi.updateMember(teamId, newMemberId, { role: 'vice_captain' });
      await fetchMembers();
      alert('부팀장이 변경되었습니다.');
    } catch (err) {
      const errorMessage = getErrorMessage(err, '부팀장 변경에 실패했습니다.');
      alert(errorMessage);
    } finally {
      setProcessingId(null);
    }
  };

  const handleUpdateStatus = async (memberId: string, status: TeamMember['status']) => {
    setProcessingId(memberId);
    try {
      await teamsApi.updateMember(teamId, memberId, { status });
      await fetchMembers();
      alert('상태가 변경되었습니다.');
    } catch (err) {
      const errorMessage = getErrorMessage(err, '상태 변경에 실패했습니다.');
      alert(errorMessage);
    } finally {
      setProcessingId(null);
    }
  };

  const [jerseyNumbers, setJerseyNumbers] = useState<Record<string, string>>({});

  const handleJerseyNumberChange = (memberId: string, value: string) => {
    if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0)) {
      setJerseyNumbers(prev => ({ ...prev, [memberId]: value }));
    }
  };

  const handleJerseyNumberBlur = async (memberId: string) => {
    const value = jerseyNumbers[memberId];
    if (value === undefined) return;

    setProcessingId(memberId);
    try {
      const numValue = value.trim() === '' ? undefined : parseInt(value);
      if (numValue !== undefined && (isNaN(numValue) || numValue < 0)) {
        alert('등번호는 0 이상의 숫자여야 합니다.');
        await fetchMembers(); // 원래 값으로 복원
        return;
      }
      await teamsApi.updateMember(teamId, memberId, { jerseyNumber: numValue });
      await fetchMembers();
      setJerseyNumbers(prev => {
        const newState = { ...prev };
        delete newState[memberId];
        return newState;
      });
    } catch (err) {
      const errorMessage = getErrorMessage(err, '등번호 변경에 실패했습니다.');
      alert(errorMessage);
      await fetchMembers(); // 원래 값으로 복원
    } finally {
      setProcessingId(null);
    }
  };

      const handleDeleteMember = async (memberId: string, memberName: string) => {
        if (!confirm(`정말 ${memberName}님을 팀에서 추방하시겠습니까?`)) {
          return;
        }

        setProcessingId(memberId);
        try {
          await teamsApi.deleteMember(teamId, memberId);
          // 추방된 사용자가 현재 사용자인지 확인 (현재는 서버에서 처리하므로 항상 성공)
          // 추방된 사용자는 다음 페이지 로드 시 모달이 표시됨
          await fetchMembers();
          alert('팀원이 추방되었습니다.');
        } catch (err) {
          const errorMessage = getErrorMessage(err, '팀원 추방에 실패했습니다.');
          alert(errorMessage);
        } finally {
          setProcessingId(null);
        }
      };

  const getStatusLabel = (status: TeamMember['status']) => {
    switch (status) {
      case 'active':
        return '활동';
      case 'injured':
        return '부상';
      case 'long_term_absence':
        return '장기 출전 불가';
      case 'short_term_absence':
        return '단기 출전 불가';
      default:
        return status;
    }
  };

  const getRoleLabel = (role: TeamMember['role']) => {
    switch (role) {
      case 'captain':
        return '팀장';
      case 'vice_captain':
        return '부팀장';
      case 'member':
        return '팀원';
      default:
        return role;
    }
  };

  if (!isCaptain) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
        회원관리는 팀장만 사용할 수 있습니다.
      </div>
    );
  }

  if (isLoading) {
    return <Loading size="lg" className="py-8" />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  const regularMembers = members.filter(m => m.role === 'member');
  const viceCaptains = members.filter(m => m.role === 'vice_captain');
  const captain = members.find(m => m.role === 'captain');

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>부팀장 안내:</strong> 부팀장은 최대 2명까지 임명할 수 있습니다. (현재: {viceCaptainCount}명)
        </p>
      </div>

      {/* 팀장 정보 */}
      {captain && (
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-red-600">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900">{captain.name || captain.userName}</h3>
                <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                  {getRoleLabel(captain.role)}
                </span>
              </div>
              {captain.positions && captain.positions.length > 0 && (
                <p className="text-sm text-gray-600">포지션: {captain.positions.join(', ')}</p>
              )}
              <p className="text-sm text-gray-600">상태: {getStatusLabel(captain.status)}</p>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                placeholder="등번호"
                value={jerseyNumbers[captain.id] !== undefined ? jerseyNumbers[captain.id] : (captain.jerseyNumber || '')}
                onChange={(e) => handleJerseyNumberChange(captain.id, e.target.value)}
                onBlur={() => handleJerseyNumberBlur(captain.id)}
                disabled={processingId === captain.id}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 w-20"
              />
              <select
                value={captain.status}
                onChange={(e) => handleUpdateStatus(captain.id, e.target.value as TeamMember['status'])}
                disabled={processingId === captain.id}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              >
                <option value="active">활동</option>
                <option value="injured">부상</option>
                <option value="long_term_absence">장기 출전 불가</option>
                <option value="short_term_absence">단기 출전 불가</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 부팀장 목록 */}
      {viceCaptains.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">부팀장 ({viceCaptains.length}/2)</h3>
          <div className="space-y-3">
            {viceCaptains.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-yellow-600"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-base font-semibold text-gray-900">{member.name || member.userName}</h4>
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                        {getRoleLabel(member.role)}
                      </span>
                    </div>
                    {member.positions && member.positions.length > 0 && (
                      <p className="text-sm text-gray-600 mb-1">포지션: {member.positions.join(', ')}</p>
                    )}
                    <p className="text-sm text-gray-600 mb-1">상태: {getStatusLabel(member.status)}</p>
                    {member.phone && (
                      <p className="text-sm text-gray-600">연락처: {member.phone}</p>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="number"
                      min="0"
                      placeholder="등번호"
                      value={jerseyNumbers[member.id] !== undefined ? jerseyNumbers[member.id] : (member.jerseyNumber || '')}
                      onChange={(e) => handleJerseyNumberChange(member.id, e.target.value)}
                      onBlur={() => handleJerseyNumberBlur(member.id)}
                      disabled={processingId === member.id}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 w-20"
                    />
                    <select
                      value={member.status}
                      onChange={(e) => handleUpdateStatus(member.id, e.target.value as TeamMember['status'])}
                      disabled={processingId === member.id}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                    >
                      <option value="active">활동</option>
                      <option value="injured">부상</option>
                      <option value="long_term_absence">장기 출전 불가</option>
                      <option value="short_term_absence">단기 출전 불가</option>
                    </select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveViceCaptain(member.id)}
                      isLoading={processingId === member.id}
                      disabled={processingId !== null}
                      className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                    >
                      부팀장 해제
                    </Button>
                    {regularMembers.length > 0 && (
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleChangeViceCaptain(member.id, e.target.value);
                            e.target.value = '';
                          }
                        }}
                        disabled={processingId !== null}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                      >
                        <option value="">부팀장 변경...</option>
                        {regularMembers.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name || m.userName}에게 변경
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 일반 팀원 목록 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          일반 팀원 ({regularMembers.length})
        </h3>
        {regularMembers.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
            일반 팀원이 없습니다.
          </div>
        ) : (
          <div className="space-y-3">
            {regularMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-lg shadow p-4 sm:p-6 border border-gray-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-base font-semibold text-gray-900">{member.name || member.userName}</h4>
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                        {getRoleLabel(member.role)}
                      </span>
                    </div>
                    {member.positions && member.positions.length > 0 && (
                      <p className="text-sm text-gray-600 mb-1">포지션: {member.positions.join(', ')}</p>
                    )}
                    <p className="text-sm text-gray-600 mb-1">상태: {getStatusLabel(member.status)}</p>
                    {member.phone && (
                      <p className="text-sm text-gray-600">연락처: {member.phone}</p>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="number"
                      min="0"
                      placeholder="등번호"
                      value={jerseyNumbers[member.id] !== undefined ? jerseyNumbers[member.id] : (member.jerseyNumber || '')}
                      onChange={(e) => handleJerseyNumberChange(member.id, e.target.value)}
                      onBlur={() => handleJerseyNumberBlur(member.id)}
                      disabled={processingId === member.id}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 w-20"
                    />
                    <select
                      value={member.status}
                      onChange={(e) => handleUpdateStatus(member.id, e.target.value as TeamMember['status'])}
                      disabled={processingId === member.id}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                    >
                      <option value="active">활동</option>
                      <option value="injured">부상</option>
                      <option value="long_term_absence">장기 출전 불가</option>
                      <option value="short_term_absence">단기 출전 불가</option>
                    </select>
                    {canAppointViceCaptain && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleAppointViceCaptain(member.id)}
                        isLoading={processingId === member.id}
                        disabled={processingId !== null}
                      >
                        부팀장 임명
                      </Button>
                    )}
                    {!canAppointViceCaptain && viceCaptains.length > 0 && (
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleChangeViceCaptain(e.target.value, member.id);
                            e.target.value = '';
                          }
                        }}
                        disabled={processingId !== null}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                      >
                        <option value="">부팀장으로 변경...</option>
                        {viceCaptains.map((vc) => (
                          <option key={vc.id} value={vc.id}>
                            {vc.name || vc.userName} 대신 부팀장 임명
                          </option>
                        ))}
                      </select>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteMember(member.id, member.name || member.userName || '')}
                      isLoading={processingId === member.id}
                      disabled={processingId !== null}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      팀 추방
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

