
interface MatchSetupProps {
  teamScores: {
    [team: string]: {
      gross: number;
      net: number;
    };
  };
  players: {
    name: string;
    team: string;
  }[];
}
