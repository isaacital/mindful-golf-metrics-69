
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2 } from "lucide-react";

interface Player {
  id: string;
  name: string;
  handicap_index: number | null;
}

interface PlayerCardProps {
  player: Player;
  editingPlayer: Player | null;
  onEdit: (player: Player) => void;
  onDelete: (player: Player) => void;
  onSave: (playerId: string, handicap: string) => void;
  onCancel: () => void;
  setEditingPlayer: (player: Player | null) => void;
}

export const PlayerCard = ({
  player,
  editingPlayer,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  setEditingPlayer,
}: PlayerCardProps) => {
  return (
    <div className="flex items-center gap-2 p-2 border rounded-lg bg-background/50">
      <span className="font-medium truncate flex-1">{player.name}</span>
      {editingPlayer?.id === player.id ? (
        <>
          <Input
            type="number"
            step="0.1"
            value={editingPlayer.handicap_index || ""}
            onChange={(e) => setEditingPlayer({
              ...editingPlayer,
              handicap_index: e.target.value ? parseFloat(e.target.value) : null
            })}
            className="w-[80px]"
          />
          <Button 
            variant="default" 
            size="sm"
            onClick={() => onSave(player.id, editingPlayer.handicap_index?.toString() || "")}
          >
            Save
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </>
      ) : (
        <>
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {player.handicap_index?.toFixed(1) ?? '-'}
          </span>
          <Button 
            variant="outline"
            size="icon"
            onClick={() => onEdit(player)}
            className="h-8 w-8"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline"
            size="icon"
            onClick={() => onDelete(player)}
            className="h-8 w-8"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </>
      )}
    </div>
  );
};
