
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Add Player</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Player Name"
          value={newPlayerName}
          onChange={(e) => onNameChange(e.target.value)}
          className="md:w-[300px]"
        />
        <Input
          placeholder="Handicap Index"
          type="number"
          step="0.1"
          value={newPlayerHandicap}
          onChange={(e) => onHandicapChange(e.target.value)}
          className="md:w-[200px]"
        />
        <Select value={newPlayerTee} onValueChange={onTeeChange}>
          <SelectTrigger className="md:w-[200px]">
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
        <Button onClick={onAddPlayer}>Add Player</Button>
      </CardContent>
    </Card>
  );
};
