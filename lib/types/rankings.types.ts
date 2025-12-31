// 랭킹 관련 타입
export interface RankingPlayer {
  userId: string;
  userName: string;
  value: number;
  rank: number;
}

export interface Rankings {
  attendance: RankingPlayer[];
  games: RankingPlayer[];
  goals: RankingPlayer[];
  assists: RankingPlayer[];
}

