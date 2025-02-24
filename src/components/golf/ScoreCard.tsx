import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { 
  calculateHoleScores, 
  formatScoreToPar, 
  getScoreColor, 
  calculateTeamScores 
} from "@/utils/golfScoring";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface Player {
  id: string;
  name: string;
  handicapIndex: number;
  tee: string;
  team: string;
  courseHandicap: number;
  scores: (number | null)[];
}

interface TeamScores {
  [team: string]: {
    gross: number;
    net: number;
  };
}

interface Hole {
  number: number;
  par: number;
  handicap: number;
}

interface Tee {
  color: string;
  rating: number;
  slope: number;
}

interface ScoreCardProps {
  players: Player[];
  holes: Hole[];
  tees: Tee[];
  onUpdateScore: (playerId: string, holeNumber: number, score: number) => void;
  onUpdateTeam: (playerId: string, team: string) => void;
  onUpdateTee: (playerId: string, tee: string) => void;
  onRemovePlayer: (playerId: string) => void;
}

export const ScoreCard = ({ 
  players, 
  holes, 
  tees,
  onUpdateScore, 
  onUpdateTeam,
  onUpdateTee,
  onRemovePlayer 
}: ScoreCardProps) => {
  const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);
  
  if (players.length === 0) return null;

  const totalPar = holes.reduce((sum, hole) => sum + hole.par, 0);
  const teamScores: TeamScores = calculateTeamScores(players);

  const existingTeams = Array.from(new Set(players.map(p => p.team))).sort();
  const nextTeam = String.fromCharCode(
    Math.max(
      ...existingTeams.map(t => t.charCodeAt(0)),
      'A'.charCodeAt(0) - 1
    ) + 1
  );

  const handleDelete = (player: Player) => {
    setPlayerToDelete(player);
  };

  const confirmDelete = () => {
    if (playerToDelete) {
      onRemovePlayer(playerToDelete.id);
      setPlayerToDelete(null);
    }
  };

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
                <th className="py-2 px-2 text-left w-[40px]"></th>
                <th className="py-2 px-2 text-left w-[180px]">Player</th>
                <th className="py-2 px-2 text-left w-[80px]">Team</th>
                <th className="py-2 px-2 text-left w-[120px]">Tee</th>
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
                <th className="py-2 px-2 text-left"></th>
                {holes.map((hole) => (
                  <th key={`handicap-${hole.number}`} className="py-2 px-1 text-center text-xs text-muted-foreground">
                    {hole.handicap}
                  </th>
                ))}
                <th className="py-2 px-1 text-center">-</th>
                <th className="py-2 px-1 text-center">-</th>
                <th className="py-2 px-1 text-center">-</th>
                <th className="py-2 px-1 text-center">-</th>
                <th className="py-2 px-1 text-center">-</th>
              </tr>
              <tr className="border-b">
                <th className="py-2 px-2 text-left"></th>
                <th className="py-2 px-2 text-left">Par</th>
                <th className="py-2 px-2 text-left"></th>
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
                <th className="py-2 px-1 text-center">-</th>
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
                    <td className="py-2 px-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(player)}
                        className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                    <td className="py-2 px-2">
                      <div className="text-sm font-medium truncate">{player.name}</div>
                      <div className="text-xs text-muted-foreground">
                        ({player.handicapIndex})
                        <br />
                        Course Handicap: {player.courseHandicap}
                      </div>
                    </td>
                    <td className="py-2 px-2">
                      <Select value={player.team} onValueChange={(team) => onUpdateTeam(player.id, team)}>
                        <SelectTrigger className="h-8 w-20 text-xs">
                          <SelectValue placeholder="Team" />
                        </SelectTrigger>
                        <SelectContent>
                          {existingTeams.map(team => (
                            <SelectItem key={team} value={team}>
                              Team {team}
                            </SelectItem>
                          ))}
                          <SelectItem value={nextTeam}>Team {nextTeam}</SelectItem>
                        </SelectContent>
                      </Select>
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
              {Object.entries(teamScores).map(([team, scores], index) => (
                <tr key={team} className={index === 0 ? "border-t-2 border-gray-300 bg-gray-50" : "border-t border-gray-300 bg-gray-50"}>
                  <td colSpan={3} className="py-3 px-2 font-bold">Team {team} Total</td>
                  <td colSpan={20} className="py-3 px-2 text-right font-bold">
                    Gross: {scores.gross} | Net: {scores.net}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>

      <AlertDialog open={!!playerToDelete} onOpenChange={() => setPlayerToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Player</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {playerToDelete?.name} from this match? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
