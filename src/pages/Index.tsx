
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

// Temporary sample data (we'll move this to a database later)
const sampleCourses = [
  {
    id: 1,
    name: "Pine Valley Golf Club",
    holes: Array(18).fill(null).map((_, i) => ({
      number: i + 1,
      par: 4,
      handicap: i + 1,
    })),
    tees: ["Blue", "White", "Red"],
  },
];

interface Player {
  id: string;
  name: string;
  handicapIndex: number;
  tee: string;
  scores: (number | null)[];
}

const Index = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedCourse, setSelectedCourse] = useState(sampleCourses[0]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerHandicap, setNewPlayerHandicap] = useState("");

  const addPlayer = () => {
    if (newPlayerName && newPlayerHandicap) {
      const newPlayer: Player = {
        id: Date.now().toString(),
        name: newPlayerName,
        handicapIndex: parseFloat(newPlayerHandicap),
        tee: selectedCourse.tees[0],
        scores: Array(18).fill(null),
      };
      setPlayers([...players, newPlayer]);
      setNewPlayerName("");
      setNewPlayerHandicap("");
    }
  };

  const updateScore = (playerId: string, holeNumber: number, score: number) => {
    setPlayers(players.map(player => {
      if (player.id === playerId) {
        const newScores = [...player.scores];
        newScores[holeNumber - 1] = score;
        return { ...player, scores: newScores };
      }
      return player;
    }));
  };

  return (
    <div className="min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8">Golf Score Tracker</h1>

        {/* Course Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select Course</CardTitle>
          </CardHeader>
          <CardContent>
            <Select defaultValue={selectedCourse.id.toString()} onValueChange={(value) => 
              setSelectedCourse(sampleCourses.find(course => course.id.toString() === value)!)
            }>
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {sampleCourses.map(course => (
                  <SelectItem key={course.id} value={course.id.toString()}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Add Player Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add Player</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-4">
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
          </CardContent>
        </Card>

        {/* Scoring Table */}
        {players.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Score Card</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4 text-left">Player</th>
                    {selectedCourse.holes.map((hole) => (
                      <th key={hole.number} className="py-2 px-4 text-center">
                        {hole.number}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {players.map((player) => (
                    <tr key={player.id} className="border-b">
                      <td className="py-2 px-4">
                        {player.name} ({player.handicapIndex})
                      </td>
                      {player.scores.map((score, index) => (
                        <td key={index} className="py-2 px-4">
                          <Input
                            type="number"
                            value={score || ""}
                            onChange={(e) => 
                              updateScore(player.id, index + 1, parseInt(e.target.value))
                            }
                            className="w-16 text-center"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default Index;
