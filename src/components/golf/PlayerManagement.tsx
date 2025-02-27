
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AddPlayerDialog } from "./AddPlayerDialog";
import { PlayerCard } from "./PlayerCard";
import { DeletePlayerDialog } from "./DeletePlayerDialog";
import { AllPlayersDialog } from "./AllPlayersDialog";

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

  return (
    <>
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle>My Players</CardTitle>
          <AddPlayerDialog onPlayerAdded={refetch} />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-left">
            {players?.slice(0, 6).map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                editingPlayer={editingPlayer}
                onEdit={setEditingPlayer}
                onDelete={setPlayerToDelete}
                onSave={updateHandicap}
                onCancel={() => setEditingPlayer(null)}
                setEditingPlayer={setEditingPlayer}
              />
            ))}
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

      <AllPlayersDialog
        isOpen={showAllPlayers}
        onOpenChange={setShowAllPlayers}
        players={players || []}
        editingPlayer={editingPlayer}
        onEdit={setEditingPlayer}
        onDelete={setPlayerToDelete}
        onSave={updateHandicap}
        onCancel={() => setEditingPlayer(null)}
        setEditingPlayer={setEditingPlayer}
      />

      <DeletePlayerDialog
        playerName={playerToDelete?.name}
        isOpen={!!playerToDelete}
        onOpenChange={(open) => !open && setPlayerToDelete(null)}
        onConfirm={deletePlayer}
      />
    </>
  );
};
