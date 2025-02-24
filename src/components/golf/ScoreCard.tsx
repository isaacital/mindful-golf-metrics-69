import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  calculateHoleScores, 
  formatScoreToPar, 
  getScoreColor, 
  calculateTeamScores 
} from "@/utils/golfScoring";

interface Player {
  id: string;
  name: string;
  handicapIndex: number;
  tee: string;
  team: 'A' | 'B';
  courseHandicap: number;
  scores: (number | null)[];
}

interface Hole {
  number: number;
  par: number;
  handicap: number;
}

interface ScoreCardProps {
  players: Player[];
  holes: Hole[];
  onUpdateScore: (playerId: string, holeNumber: number, score: number) => void;
  onUpdateTeam: (playerId: string, team: 'A' | 'B') => void;
}

export const ScoreCard = ({ players, holes, onUpdateScore, onUpdateTeam }: ScoreCardProps) => {
  if (players.length === 0) return null;

  const totalPar = holes.reduce((sum, hole) => sum + hole.par, 0);
  const teamScores = calculateTeamScores(players);

  return (
    <Card className="bg-white/50 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle>Score Card</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-2 text-left w-[180px]">Player</th>
                <th className="py-2 px-2 text-left w-[80px]">Team</th>
                {holes.map((hole) => (
                  <th key={hole.number} className="py-2 px-1 text-center w-[45px]">
                    {hole.number}
                  </th>
                ))}
                <th className="py-2 px-1 text-center w-[45px]">Out</th>
                <th className="py-2 px-1 text-center w-[45px]">In</th>
                <th className="py-2 px-1 text-center w-[60px]">Total</th>
                <th className="py-2 px-1 text-center w-[60px]">Net</th>
              </tr>
              <tr className="border-b">
                <th className="py-2 px-2 text-left"></th>
                <th className="py-2 px-2 text-left">HCP</th>
                {holes.map((hole) => (
                  <th key={`handicap-${hole.number}`} className="py-2 px-1 text-center text-xs text-muted-foreground">
                    {hole.handicap}
                  </th>
                ))}
                <th className="py-2 px-1 text-center">-</th>
                <th className="py-2 px-1 text-center">-</th>
                <th className="py-2 px-1 text-center">-</th>
                <th className="py-2 px-1 text-center">-</th>
              </tr>
              <tr className="border-b">
                <th className="py-2 px-2 text-left"></th>
                <th className="py-2 px-2 text-left">Par</th>
                {holes.map((hole) => (
                  <th key={`par-${hole.number}`} className="py-2 px-1 text-center text-xs text-muted-foreground">
                    {hole.par}
                  </th>
                ))}
                <th className="py-2 px-1 text-center text-xs text-muted-foreground">
                  {holes.slice(0, 9).reduce((sum, hole) => sum + hole.par, 0)}
                </th>
                <th className="py-2 px-1 text-center text-xs text-muted-foreground">
                  {holes.slice(9, 18).reduce((sum, hole) => sum + hole.par, 0)}
                </th>
                <th className="py-2 px-1 text-center text-xs text-muted-foreground">
                  {totalPar}
                </th>
                <th className="py-2 px-1 text-center text-xs text-muted-foreground">-</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => {
                const totals = calculateHoleScores(player.scores);
                const scoreToPar = formatScoreToPar(totals.total, totalPar);
                const netScore = totals.total - player.courseHandicap;
                const netScoreToPar = formatScoreToPar(netScore, totalPar);
                
                return (
                  <tr key={player.id} className="border-b">
                    <td className="py-2 px-2">
                      <div className="text-sm font-medium truncate">{player.name}</div>
                      <div className="text-xs text-muted-foreground">
                        ({player.handicapIndex}) - {player.tee}
                        <br />
                        Course Handicap: {player.courseHandicap}
                      </div>
                    </td>
                    <td className="py-2 px-2">
                      <RadioGroup
                        value={player.team}
                        onValueChange={(value: 'A' | 'B') => onUpdateTeam(player.id, value)}
                        className="flex flex-row gap-1"
                      >
                        <div className="flex items-center gap-0.5">
                          <RadioGroupItem value="A" id={`team-a-${player.id}`} className="h-3 w-3" />
                          <Label htmlFor={`team-a-${player.id}`} className="text-xs">A</Label>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <RadioGroupItem value="B" id={`team-b-${player.id}`} className="h-3 w-3" />
                          <Label htmlFor={`team-b-${player.id}`} className="text-xs">B</Label>
                        </div>
                      </RadioGroup>
                    </td>
                    {player.scores.map((score, index) => (
                      <td key={index} className="py-1 px-0.5">
                        <Input
                          type="number"
                          value={score || ""}
                          onChange={(e) => 
                            onUpdateScore(player.id, index + 1, parseInt(e.target.value))
                          }
                          className="w-9 h-7 text-center p-0 text-sm"
                        />
                      </td>
                    ))}
                    <td className="py-1 px-0.5 text-center font-medium text-sm">{totals.front9}</td>
                    <td className="py-1 px-0.5 text-center font-medium text-sm">{totals.back9}</td>
                    <td className="py-1 px-0.5 text-center font-medium text-sm">
                      {totals.total} <span className={getScoreColor(scoreToPar)}>({scoreToPar})</span>
                    </td>
                    <td className="py-1 px-0.5 text-center font-medium text-sm">
                      {netScore} <span className={getScoreColor(netScoreToPar)}>({netScoreToPar})</span>
                    </td>
                  </tr>
                );
              })}
              <tr className="border-t-2 border-gray-300 bg-gray-50">
                <td colSpan={2} className="py-3 px-2 font-bold">Team A Total</td>
                <td colSpan={19} className="py-3 px-2 text-right font-bold">
                  Gross: {teamScores.A.gross} | Net: {teamScores.A.net}
                </td>
              </tr>
              <tr className="border-t border-gray-300 bg-gray-50">
                <td colSpan={2} className="py-3 px-2 font-bold">Team B Total</td>
                <td colSpan={19} className="py-3 px-2 text-right font-bold">
                  Gross: {teamScores.B.gross} | Net: {teamScores.B.net}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
