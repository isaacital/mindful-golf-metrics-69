
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AddPlayerDialogProps {
  onPlayerAdded: () => void;
}

export const AddPlayerDialog = ({ onPlayerAdded }: AddPlayerDialogProps) => {
  const [open, setOpen] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerHandicap, setNewPlayerHandicap] = useState("");

  const addPlayer = async () => {
    if (!newPlayerName) {
      toast.error('Please enter a player name');
      return;
    }

    try {
      const { error } = await supabase
        .from('players')
        .insert([
          {
            name: newPlayerName,
            handicap_index: newPlayerHandicap ? parseFloat(newPlayerHandicap) : null,
          }
        ]);

      if (error) throw error;

      toast.success('Player added successfully');
      setNewPlayerName("");
      setNewPlayerHandicap("");
      setOpen(false);
      onPlayerAdded();
    } catch (error) {
      toast.error('Failed to add player');
      console.error('Error adding player:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Player</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Player</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Player Name</Label>
            <Input
              id="name"
              placeholder="Player Name"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="handicap">Handicap Index</Label>
            <Input
              id="handicap"
              placeholder="Handicap"
              type="number"
              step="0.1"
              value={newPlayerHandicap}
              onChange={(e) => setNewPlayerHandicap(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={addPlayer}>
            Add Player
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
