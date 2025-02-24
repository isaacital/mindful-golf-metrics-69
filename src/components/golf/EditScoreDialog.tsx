
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useState, useEffect } from "react";

interface EditScoreDialogProps {
  open: boolean;
  onClose: () => void;
  player: {
    id: string;
    name: string;
    scores: (number | null)[];
  } | null;
  holes: Array<{ number: number; par: number; handicap: number }>;
  onUpdateScore: (playerId: string, holeNumber: number, score: number) => void;
}

export const EditScoreDialog = ({
  open,
  onClose,
  player,
  holes,
  onUpdateScore,
}: EditScoreDialogProps) => {
  if (!player) return null;

  const [scores, setScores] = useState<(number | null)[]>(player.scores);

  useEffect(() => {
    if (player) {
      setScores(player.scores);
    }
  }, [player]);

  const handleScoreChange = (index: number, value: string) => {
    const score = value === "" ? null : parseInt(value, 10);
    const newScores = [...scores];
    newScores[index] = score;
    setScores(newScores);

    if (score !== null && !isNaN(score) && score > 0) {
      onUpdateScore(player.id, index + 1, score);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Scores - {player.name}</DialogTitle>
          <DialogDescription>
            Enter scores for each hole. Leave empty for incomplete holes.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-6 md:grid-cols-9 gap-4 p-4">
          {holes.map((hole, index) => (
            <div key={hole.number} className="space-y-2">
              <div className="text-sm font-medium text-center">
                Hole {hole.number}
                <div className="text-xs text-muted-foreground">Par {hole.par}</div>
              </div>
              <Input
                type="number"
                value={scores[index] === null ? "" : scores[index]}
                onChange={(e) => handleScoreChange(index, e.target.value)}
                className="w-full text-center"
                min={1}
                placeholder="-"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={onClose}>
            <Check className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
