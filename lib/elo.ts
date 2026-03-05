export const STARTING_ELO = 1200;
export const K_FACTOR = 32;

export function expectedScore(playerElo: number, opponentElo: number): number {
  return 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));
}

export function newElo(
  currentElo: number,
  opponentElo: number,
  won: boolean
): number {
  const expected = expectedScore(currentElo, opponentElo);
  const actual = won ? 1 : 0;
  return Math.round(currentElo + K_FACTOR * (actual - expected));
}

export function calculateEloChanges(
  player1Elo: number,
  player2Elo: number,
  player1Won: boolean
): { player1NewElo: number; player2NewElo: number; player1Change: number; player2Change: number } {
  const player1NewElo = newElo(player1Elo, player2Elo, player1Won);
  const player2NewElo = newElo(player2Elo, player1Elo, !player1Won);

  return {
    player1NewElo,
    player2NewElo,
    player1Change: player1NewElo - player1Elo,
    player2Change: player2NewElo - player2Elo,
  };
}

export function eloRank(elo: number): { label: string; color: string } {
  if (elo >= 1600) return { label: "Shark", color: "#c9a84c" };
  if (elo >= 1450) return { label: "Pro", color: "#a0c878" };
  if (elo >= 1300) return { label: "Hustler", color: "#78a8c8" };
  if (elo >= 1150) return { label: "Regular", color: "#c8c8c8" };
  return { label: "Rookie", color: "#8a7a6a" };
}
