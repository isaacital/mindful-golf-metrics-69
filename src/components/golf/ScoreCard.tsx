
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2, PenLine } from "lucide-react";
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
import { EditScoreDialog } from "./EditScoreDialog";

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
  onUpdateTeam: (playerId: string, team: 'A' | 'B') => void;
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
  const [playerToEdit, setPlayerToEdit] = useState<Player | null>(null);
  
  if (players.length === 0) return null;

  const totalPar = holes.reduce((sum, hole) => sum + hole.par, 0);
  const teamScores = calculateTeamScores(players);

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
                <th className="py-2 px-2 text-center w-[80px]">Out</th>
                <th className="py-2 px-2 text-center w-[80px]">In</th>
                <th className="py-2 px-2 text-center w-[80px]">Total</th>
                <th className="py-2 px-2 text-center w-[80px]">Net</th>
                <th className="py-2 px-2 text-center w-[80px]">Actions</th>
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
                      <Select value={player.team} onValueChange={(team: 'A' | 'B') => onUpdateTeam(player.id, team)}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Team" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">Team A</SelectItem>
                          <SelectItem value="B">Team B</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-2 px-2">
                      <Select value={player.tee} onValueChange={(tee) => onUpdateTee(player.id, tee)}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Select tee" />
                        </SelectTrigger>
                        <SelectContent>
                          {tees.map(tee => (
                            <SelectItem key={tee.color} value={tee.color}>
                              {tee.color} ({tee.rating}/{tee.slope})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-2 px-2 text-center">{totals.front9}</td>
                    <td className="py-2 px-2 text-center">{totals.back9}</td>
                    <td className="py-2 px-2 text-center">
                      {totals.total} <span className={getScoreColor(scoreToPar)}>({scoreToPar})</span>
                    </td>
                    <td className="py-2 px-2 text-center">
                      {netScore} <span className={getScoreColor(netScoreToPar)}>({netScoreToPar})</span>
                    </td>
                    <td className="py-2 px-2 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setPlayerToEdit(player)}
                        className="h-7 w-7 text-muted-foreground hover:text-primary"
                      >
                        <PenLine className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
              <tr className="border-t-2 border-gray-300 bg-gray-50">
                <td colSpan={3} className="py-3 px-2 font-bold">Team A Total</td>
                <td colSpan={6} className="py-3 px-2 text-right font-bold">
                  Gross: {teamScores.A.gross} | Net: {teamScores.A.net}
                </td>
              </tr>
              <tr className="border-t border-gray-300 bg-gray-50">
                <td colSpan={3} className="py-3 px-2 font-bold">Team B Total</td>
                <td colSpan={6} className="py-3 px-2 text-right font-bold">
                  Gross: {teamScores.B.gross} | Net: {teamScores.B.net}
                </td>
              </tr>
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

      <EditScoreDialog
        open={!!playerToEdit}
        onClose={() => setPlayerToEdit(null)}
        player={playerToEdit}
        holes={holes}
        onUpdateScore={onUpdateScore}
      />
    </Card>
  );
};
