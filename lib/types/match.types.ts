// 경기 관련 타입
export interface Match {
  id: string;
  teamId: string;
  opponentTeamName: string;
  date: string;
  time?: string;
  location?: string;
  status: 'scheduled' | 'in_progress' | 'finished' | 'cancelled';
  totalOurScore?: number;
  totalOpponentScore?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MatchListItem {
  id: string;
  opponentTeamName: string;
  date: string;
  gameCount: number;
  wins: number;
  draws: number;
  losses: number;
  totalGoals: number;
  totalAssists: number;
  totalOpponentGoals: number;
}

export interface Game {
  id: string;
  matchId: string;
  gameNumber: number;
  ourScore: number;
  opponentScore: number;
  result: 'win' | 'draw' | 'loss';
}

export interface MatchDetail extends Match {
  games: Game[];
  attendances?: MatchAttendance[];
}

export interface MatchAttendance {
  id: string;
  userId: string;
  userName: string;
  status: 'attending' | 'not_attending' | 'maybe' | 'late' | 'absent';
  votedAt: string;
}

export interface CreateMatchRequest {
  teamId: string;
  opponentTeamName: string;
  date: string;
  time?: string;
  location?: string;
}

export interface UpdateMatchRequest {
  opponentTeamName?: string;
  date?: string;
  time?: string;
  location?: string;
  status?: 'scheduled' | 'in_progress' | 'finished' | 'cancelled';
}

export interface AttendanceVoteRequest {
  status: 'attending' | 'not_attending' | 'maybe';
}

export interface PlayerRecord {
  userId: string;
  userName: string;
  played: boolean;
  goals: number;
  assists: number;
}

export interface GameRecord {
  gameNumber: number;
  ourScore: number;
  opponentScore: number;
  playerRecords: PlayerRecord[];
}

export interface RecordMatchRequest {
  games: GameRecord[];
  notes?: string;
}
