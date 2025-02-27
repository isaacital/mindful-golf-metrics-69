
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlayerCard } from "./PlayerCard";

interface Player {
  id: string;
  name: string;
  handicap_index: number | null;
}

interface AllPlayersDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  players: Player[];
  editingPlayer: Player | null;
  onEdit: (player: Player) => void;
  onDelete: (player: Player) => void;
  onSave: (playerId: string, handicap: string) => void;
  onCancel: () => void;
  setEditingPlayer: (player: Player | null) => void;
}

export const AllPlayersDialog = ({
  isOpen,
  onOpenChange,
  players,
  editingPlayer,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  setEditingPlayer,
}: AllPlayersDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>All Players</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-left">
          {players?.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              editingPlayer={editingPlayer}
              onEdit={onEdit}
              onDelete={onDelete}
              onSave={onSave}
              onCancel={onCancel}
              setEditingPlayer={setEditingPlayer}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
