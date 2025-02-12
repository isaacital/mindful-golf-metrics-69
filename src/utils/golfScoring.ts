
interface Player {
  id: string;
  name: string;
  handicapIndex: number;
  tee: string;
  team: 'A' | 'B';
  courseHandicap: number;
  scores: (number | null)[];
}

interface TeamScores {
  A: { gross: number; net: number };
  B: { gross: number; net: number };
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
  const teamScores = {
    A: { gross: 0, net: 0 },
    B: { gross: 0, net: 0 }
  };

  players.forEach(player => {
    const totals = calculateHoleScores(player.scores);
    const netScore = totals.total - player.courseHandicap;
    
    if (player.team === 'A') {
      teamScores.A.gross += totals.total;
      teamScores.A.net += netScore;
    } else {
      teamScores.B.gross += totals.total;
      teamScores.B.net += netScore;
    }
  });

  return teamScores;
};
