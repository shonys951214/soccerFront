// 대시보드 관련 타입
export interface NextMatch {
  id: string;
  opponentTeamName: string;
  date: string;
  time?: string;
  location?: string;
  myAttendanceStatus?: 'attending' | 'not_attending' | 'maybe';
}

export interface TeamStats {
  matchCount: number;
  wins: number;
  draws: number;
  losses: number;
  goalsPerMatch: number;
  concededPerMatch: number;
  cleanSheetRate: number;
  noGoalRate: number;
  cleanSheetMatches: number;
  noGoalMatches: number;
}

export interface GameStats {
  gameCount: number;
  wins: number;
  draws: number;
  losses: number;
  goalsPerGame: number;
  concededPerGame: number;
  cleanSheetRate: number;
  noGoalRate: number;
  cleanSheetGames: number;
  noGoalGames: number;
}

export interface TotalGoals {
  totalGoals: number;
  totalConceded: number;
  goalDifference: number;
  assists: number;
  fieldGoals: number;
  freeKickGoals: number;
  penaltyGoals: number;
  ownGoals: number;
}

export interface Top10Player {
  userId: string;
  userName: string;
  value: number;
  rank: number;
}

export interface AttendanceSummary {
  attending: number;
  late: number;
  absent: number;
}

export interface DashboardSummary {
  nextMatch?: NextMatch;
  teamComposition: {
    totalMembers: number;
    positionCount: {
      GK: number;
      DF: number;
      MF: number;
      FW: number;
    };
  };
  teamStats: {
    matchStats: TeamStats;
    gameStats: GameStats;
    totalGoals: TotalGoals;
  };
  top10: {
    appearances: Top10Player[];
    goals: Top10Player[];
    assists: Top10Player[];
    winRate: Top10Player[];
  };
  attendance: AttendanceSummary;
}

