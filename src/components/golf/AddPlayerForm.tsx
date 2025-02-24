
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Tee {
  color: string;
  rating: number;
  slope: number;
}

interface AddPlayerFormProps {
  tees: Tee[];
  newPlayerName: string;
  newPlayerHandicap: string;
  newPlayerTee: string;
  onNameChange: (name: string) => void;
  onHandicapChange: (handicap: string) => void;
  onTeeChange: (tee: string) => void;
  onAddPlayer: () => void;
}

interface SavedPlayer {
  id: string;
  name: string;
  handicap_index: number | null;
}

export const AddPlayerForm = ({
  tees,
  newPlayerName,
  newPlayerHandicap,
  newPlayerTee,
  onNameChange,
  onHandicapChange,
  onTeeChange,
  onAddPlayer,
}: AddPlayerFormProps) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");

  const { data: savedPlayers } = useQuery({
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
      return data as SavedPlayer[];
    }
  });

  const handlePlayerSelect = (playerId: string) => {
    const player = savedPlayers?.find(p => p.id === playerId);
    if (player) {
      setSelectedPlayerId(playerId);
      onNameChange(player.name);
      onHandicapChange(player.handicap_index?.toString() ?? "");
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Add Player to Match</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-start gap-4">
            <Button
              variant={isAddingNew ? "default" : "outline"}
              onClick={() => setIsAddingNew(true)}
              className="w-full md:w-auto"
            >
              Add New Player
            </Button>
            <Button
              variant={!isAddingNew ? "default" : "outline"}
              onClick={() => setIsAddingNew(false)}
              className="w-full md:w-auto"
            >
              Select Existing Player
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            {isAddingNew ? (
              <>
                <div className="flex-1">
                  <Label htmlFor="playerName">Player Name</Label>
                  <Input
                    id="playerName"
                    placeholder="Player Name"
                    value={newPlayerName}
                    onChange={(e) => onNameChange(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="md:w-[200px]">
                  <Label htmlFor="handicapIndex">Handicap Index</Label>
                  <Input
                    id="handicapIndex"
                    placeholder="Handicap Index"
                    type="number"
                    step="0.1"
                    value={newPlayerHandicap}
                    onChange={(e) => onHandicapChange(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </>
            ) : (
              <div className="flex-1">
                <Label htmlFor="existingPlayer">Select Player</Label>
                <Select value={selectedPlayerId} onValueChange={handlePlayerSelect}>
                  <SelectTrigger id="existingPlayer" className="mt-1">
                    <SelectValue placeholder="Select a player" />
                  </SelectTrigger>
                  <SelectContent>
                    {savedPlayers?.map(player => (
                      <SelectItem key={player.id} value={player.id}>
                        {player.name} {player.handicap_index !== null && `(${player.handicap_index.toFixed(1)})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="md:w-[200px]">
              <Label htmlFor="teeSelect">Select Tee</Label>
              <Select value={newPlayerTee} onValueChange={onTeeChange}>
                <SelectTrigger id="teeSelect" className="mt-1">
                  <SelectValue placeholder="Select tee" />
                </SelectTrigger>
                <SelectContent>
                  {tees.map(tee => (
                    <SelectItem key={tee.color} value={tee.color}>
                      {tee.color} ({tee.rating}/{tee.slope})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={onAddPlayer}
                disabled={(!isAddingNew && !selectedPlayerId) || (isAddingNew && !newPlayerName)}
                className="w-full md:w-auto"
              >
                Add to Match
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
