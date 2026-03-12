export const REVENUE_TABLE = {
  seveneleven: [0, 7300, 14300, 22000],
  personal:    [0, 10000, 20000, 30000],
} as const;

export const PLAY_THRESHOLDS = [2500, 5000, 7500] as const;
export const GOAL_PLAYS = 7500;

export function calculateRevenue(franchise: string, plays: number): number {
  const table = franchise === 'seveneleven'
    ? REVENUE_TABLE.seveneleven
    : REVENUE_TABLE.personal;
  if (plays < 2500) return table[0];
  if (plays < 5000) return table[1];
  if (plays < 7500) return table[2];
  return table[3];
}
