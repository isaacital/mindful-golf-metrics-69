
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
      <CardHeader className="pb-3">
        <CardTitle>Player Database</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-end gap-3 mb-4">
          <div className="flex-1 min-w-[200px] max-w-[300px]">
            <Input
              placeholder="Player Name"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
            />
          </div>
          <div className="w-[120px]">
            <Input
              placeholder="Handicap"
              type="number"
              step="0.1"
              value={newPlayerHandicap}
              onChange={(e) => setNewPlayerHandicap(e.target.value)}
            />
          </div>
          <Button onClick={addPlayer} className="shrink-0">Add Player</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-left">
          {players?.map((player) => (
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
                    size="sm"
                    onClick={() => setEditingPlayer(player)}
                    className="shrink-0"
                  >
                    Edit
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
