
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

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

const calculateTotals = (scores: (number | null)[]) => {
  const front9 = scores.slice(0, 9).reduce((sum, score) => sum + (score || 0), 0);
  const back9 = scores.slice(9, 18).reduce((sum, score) => sum + (score || 0), 0);
  const total = front9 + back9;
  return { front9, back9, total };
};

const formatScoreToPar = (score: number, totalPar: number) => {
  const difference = score - totalPar;
  if (difference === 0) return "E";
  return difference > 0 ? `+${difference}` : `${difference}`;
};

const getScoreColor = (scoreToPar: string) => {
  if (scoreToPar === "E") return "text-black";
  if (scoreToPar.startsWith("+")) return "text-[#ea384c]";
  return "text-[#F2FCE2]";
};

export const ScoreCard = ({ players, holes, onUpdateScore, onUpdateTeam }: ScoreCardProps) => {
  if (players.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Score Card</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-left">Player</th>
              <th className="py-2 px-4 text-left">Team</th>
              {holes.map((hole) => (
                <th key={hole.number} className="py-2 px-4 text-center">
                  {hole.number}
                </th>
              ))}
              <th className="py-2 px-4 text-center">Out</th>
              <th className="py-2 px-4 text-center">In</th>
              <th className="py-2 px-4 text-center">Total</th>
              <th className="py-2 px-4 text-center">Net</th>
            </tr>
            <tr className="border-b">
              <th className="py-2 px-4 text-left"></th>
              <th className="py-2 px-4 text-left">Par</th>
              {holes.map((hole) => (
                <th key={`par-${hole.number}`} className="py-2 px-4 text-center text-sm text-muted-foreground">
                  {hole.par}
                </th>
              ))}
              <th className="py-2 px-4 text-center text-sm text-muted-foreground">
                {holes.slice(0, 9).reduce((sum, hole) => sum + hole.par, 0)}
              </th>
              <th className="py-2 px-4 text-center text-sm text-muted-foreground">
                {holes.slice(9, 18).reduce((sum, hole) => sum + hole.par, 0)}
              </th>
              <th className="py-2 px-4 text-center text-sm text-muted-foreground">
                {holes.reduce((sum, hole) => sum + hole.par, 0)}
              </th>
              <th className="py-2 px-4 text-center text-sm text-muted-foreground">-</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => {
              const totals = calculateTotals(player.scores);
              const totalPar = holes.reduce((sum, hole) => sum + hole.par, 0);
              const scoreToPar = formatScoreToPar(totals.total, totalPar);
              const netScore = totals.total - player.courseHandicap;
              const netScoreToPar = formatScoreToPar(netScore, totalPar);
              
              return (
                <tr key={player.id} className="border-b">
                  <td className="py-2 px-4">
                    {player.name} ({player.handicapIndex}) - {player.tee}
                    <div className="text-sm text-muted-foreground">
                      Course Handicap: {player.courseHandicap}
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <RadioGroup
                      value={player.team}
                      onValueChange={(value: 'A' | 'B') => onUpdateTeam(player.id, value)}
                      className="flex flex-row space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="A" id={`team-a-${player.id}`} />
                        <Label htmlFor={`team-a-${player.id}`}>A</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="B" id={`team-b-${player.id}`} />
                        <Label htmlFor={`team-b-${player.id}`}>B</Label>
                      </div>
                    </RadioGroup>
                  </td>
                  {player.scores.map((score, index) => (
                    <td key={index} className="py-2 px-4">
                      <Input
                        type="number"
                        value={score || ""}
                        onChange={(e) => 
                          onUpdateScore(player.id, index + 1, parseInt(e.target.value))
                        }
                        className="w-16 text-center"
                      />
                    </td>
                  ))}
                  <td className="py-2 px-4 text-center font-medium">{totals.front9}</td>
                  <td className="py-2 px-4 text-center font-medium">{totals.back9}</td>
                  <td className="py-2 px-4 text-center font-medium">
                    {totals.total} <span className={getScoreColor(scoreToPar)}>({scoreToPar})</span>
                  </td>
                  <td className="py-2 px-4 text-center font-medium">
                    {netScore} <span className={getScoreColor(netScoreToPar)}>({netScoreToPar})</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};
