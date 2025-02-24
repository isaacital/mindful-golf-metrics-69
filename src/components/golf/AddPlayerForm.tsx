
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectSeparator } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AddNewPlayerDialog } from "./AddNewPlayerDialog";
import { Plus } from "lucide-react";

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
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const handlePlayerSelect = (value: string) => {
    if (value === "new") {
      setIsDialogOpen(true);
      return;
    }

    const player = savedPlayers?.find(p => p.id === value);
    if (player) {
      setSelectedPlayerId(value);
      onNameChange(player.name);
      onHandicapChange(player.handicap_index?.toString() ?? "");
    }
  };

  const handleAddNewPlayer = async (name: string, handicap: string) => {
    onNameChange(name);
    onHandicapChange(handicap);
    setSelectedPlayerId("");
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Add Player to Match</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
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
                <SelectSeparator className="my-2" />
                <SelectItem value="new" className="font-medium">
                  <span className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add New Player
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

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
              disabled={!newPlayerName || !newPlayerTee}
              className="w-full md:w-auto"
            >
              Add to Match
            </Button>
          </div>
        </div>
      </CardContent>

      <AddNewPlayerDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAddPlayer={handleAddNewPlayer}
      />
    </Card>
  );
};
