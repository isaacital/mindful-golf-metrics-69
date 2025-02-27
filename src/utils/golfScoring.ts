
import { Player } from "@/types/golf";

interface TeamScores {
  [key: string]: { gross: number; net: number };
}

export const calculateHoleScores = (scores: (number | null)[]) => {
  const front9 = scores.slice(0, 9).reduce((sum, score) => sum + (score || 0), 0);
  const back9 = scores.slice(9, 18).reduce((sum, score) => sum + (score || 0), 0);
  const total = front9 + back9;
  return { front9, back9, total };
};

export const formatScoreToPar = (score: number, totalPar: number) => {
  const difference = score - totalPar;
  if (difference === 0) return "E";
  return difference > 0 ? `+${difference}` : `${difference}`;
};

export const getScoreColor = (scoreToPar: string) => {
  if (scoreToPar === "E") return "text-black";
  if (scoreToPar.startsWith("+")) return "text-[#ea384c]";
  return "text-[#50C878]";
};

export const calculateTeamScores = (players: Player[]): TeamScores => {
  const teams = new Set(players.map(p => p.team));
  const teamScores: TeamScores = {};

  teams.forEach(team => {
    const teamPlayers = players.filter(p => p.team === team);
    const gross = teamPlayers.reduce((sum, p) => 
      sum + p.scores.reduce((s, score) => s + (score || 0), 0), 0);
    const net = teamPlayers.reduce((sum, p) => 
      sum + (p.scores.reduce((s, score) => s + (score || 0), 0) - p.courseHandicap), 0);
    
    teamScores[team] = { gross, net };
  });

  return teamScores;
};
