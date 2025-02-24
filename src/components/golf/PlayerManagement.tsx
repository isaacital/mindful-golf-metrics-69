
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Player {
  id: string;
  name: string;
  handicap_index: number | null;
}

export const PlayerManagement = () => {
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerHandicap, setNewPlayerHandicap] = useState("");
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

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
      refetch();
    } catch (error) {
      toast.error('Failed to add player');
      console.error('Error adding player:', error);
    }
  };

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Player Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Input
            placeholder="Player Name"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            className="md:w-[300px]"
          />
          <Input
            placeholder="Handicap Index"
            type="number"
            step="0.1"
            value={newPlayerHandicap}
            onChange={(e) => setNewPlayerHandicap(e.target.value)}
            className="md:w-[200px]"
          />
          <Button onClick={addPlayer}>Add Player</Button>
        </div>

        <div className="space-y-4">
          {players?.map((player) => (
            <div key={player.id} className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 border rounded-lg">
              <span className="font-medium flex-grow">{player.name}</span>
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
                    className="md:w-[200px]"
                  />
                  <Button 
                    variant="default" 
                    onClick={() => updateHandicap(player.id, editingPlayer.handicap_index?.toString() || "")}
                  >
                    Save
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setEditingPlayer(null)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <span className="text-sm">
                    Handicap Index: {player.handicap_index?.toFixed(1) ?? 'Not set'}
                  </span>
                  <Button 
                    variant="outline"
                    onClick={() => setEditingPlayer(player)}
                  >
                    Edit Handicap
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
