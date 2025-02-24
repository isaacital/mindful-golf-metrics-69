
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface AddNewPlayerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPlayer: (name: string, handicap: string) => void;
}

export const AddNewPlayerDialog = ({ open, onOpenChange, onAddPlayer }: AddNewPlayerDialogProps) => {
  const [name, setName] = useState("");
  const [handicap, setHandicap] = useState("");

  const handleSubmit = () => {
    onAddPlayer(name, handicap);
    setName("");
    setHandicap("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Player</DialogTitle>
          <DialogDescription>
            Add a new player to your database. They will be automatically added to the match.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Player Name</Label>
            <Input
              id="name"
              placeholder="Enter player name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="handicap">Handicap Index</Label>
            <Input
              id="handicap"
              type="number"
              step="0.1"
              placeholder="Enter handicap index"
              value={handicap}
              onChange={(e) => setHandicap(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!name}>Add Player</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
