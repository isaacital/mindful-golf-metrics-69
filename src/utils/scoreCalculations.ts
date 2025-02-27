
import { Player } from "@/types/golf";

export const calculateCourseHandicap = (
  handicapIndex: number,
  tee: string,
  course: any
): number => {
  const selectedTee = course?.tees?.find((t: any) => t.color === tee);
  if (!selectedTee) return 0;
  return Math.round(handicapIndex * (selectedTee.slope / 113) + (selectedTee.rating - 72));
};

export const calculateTeamScores = (players: Player[]) => {
  return {
    A: {
      gross: players.filter(p => p.team === "A")
        .reduce((sum, p) => sum + p.scores.reduce((s, score) => s + (score || 0), 0), 0),
      net: players.filter(p => p.team === "A")
        .reduce((sum, p) => sum + (p.scores.reduce((s, score) => s + (score || 0), 0) - p.courseHandicap), 0)
    },
    B: {
      gross: players.filter(p => p.team === "B")
        .reduce((sum, p) => sum + p.scores.reduce((s, score) => s + (score || 0), 0), 0),
      net: players.filter(p => p.team === "B")
        .reduce((sum, p) => sum + (p.scores.reduce((s, score) => s + (score || 0), 0) - p.courseHandicap), 0)
    }
  };
};
