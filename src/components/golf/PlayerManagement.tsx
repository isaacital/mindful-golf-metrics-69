
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Pencil } from "lucide-react";
import { AddPlayerDialog } from "./AddPlayerDialog";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Player {
  id: string;
  name: string;
  handicap_index: number | null;
}

export const PlayerManagement = () => {
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);
  const [showAllPlayers, setShowAllPlayers] = useState(false);

  const { data: players, refetch } = useQuery({
    queryKey: ['players'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('name');
      
      if (error) {
        toast.error('Failed to load players');
        throw error;
      }
      return data as Player[];
    }
  });

  const updateHandicap = async (playerId: string, handicap: string) => {
    try {
      const { error } = await supabase
        .from('players')
        .update({ 
          handicap_index: handicap ? parseFloat(handicap) : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', playerId);

      if (error) throw error;

      toast.success('Handicap updated successfully');
      setEditingPlayer(null);
      refetch();
    } catch (error) {
      toast.error('Failed to update handicap');
      console.error('Error updating handicap:', error);
    }
  };

  const deletePlayer = async () => {
    if (!playerToDelete) return;

    try {
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', playerToDelete.id);

      if (error) throw error;

      toast.success('Player deleted successfully');
      setPlayerToDelete(null);
      refetch();
    } catch (error) {
      toast.error('Failed to delete player');
      console.error('Error deleting player:', error);
    }
  };

  const renderPlayerCard = (player: Player) => (
    <div key={player.id} className="flex items-center gap-2 p-2 border rounded-lg bg-background/50">
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
            onClick={() => updateHandicap(player.id, editingPlayer.handicap_index?.toString() || "")}
          >
            Save
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setEditingPlayer(null)}
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
            onClick={() => setEditingPlayer(player)}
            className="h-8 w-8"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline"
            size="icon"
            onClick={() => setPlayerToDelete(player)}
            className="h-8 w-8"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </>
      )}
    </div>
  );

  return (
    <>
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle>My Players</CardTitle>
          <AddPlayerDialog onPlayerAdded={refetch} />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-left">
            {players?.slice(0, 6).map(renderPlayerCard)}
          </div>
          {players && players.length > 6 && (
            <div className="mt-4 text-center">
              <Button variant="outline" onClick={() => setShowAllPlayers(true)}>
                See All Players ({players.length})
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showAllPlayers} onOpenChange={setShowAllPlayers}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>All Players</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-left">
            {players?.map(renderPlayerCard)}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!playerToDelete} onOpenChange={(open) => !open && setPlayerToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {playerToDelete?.name} from the player database.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deletePlayer}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
