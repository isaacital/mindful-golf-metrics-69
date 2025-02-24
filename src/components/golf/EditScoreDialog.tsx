
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Scores - {player.name}</DialogTitle>
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
                value={player.scores[index] || ""}
                onChange={(e) => onUpdateScore(player.id, hole.number, parseInt(e.target.value))}
                className="w-full text-center"
                min={1}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" /> Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
