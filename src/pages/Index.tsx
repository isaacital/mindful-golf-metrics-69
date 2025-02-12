import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
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
    tees: [
      { color: "Blue", rating: 74.2, slope: 145 },
      { color: "White", rating: 72.1, slope: 138 },
      { color: "Red", rating: 69.8, slope: 132 },
    ],
  },
];

interface Player {
  id: string;
  name: string;
  handicapIndex: number;
  tee: string;
  team: 'A' | 'B';
  courseHandicap: number;
  scores: (number | null)[];
}

const Index = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedCourse, setSelectedCourse] = useState(sampleCourses[0]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerHandicap, setNewPlayerHandicap] = useState("");
  const [newPlayerTee, setNewPlayerTee] = useState(selectedCourse.tees[0].color);

  const calculateCourseHandicap = (handicapIndex: number, tee: string) => {
    const selectedTee = selectedCourse.tees.find(t => t.color === tee);
    if (!selectedTee) return 0;
    // Course Handicap = Handicap Index × (Slope Rating ÷ 113) + (Course Rating - Par)
    // For simplicity, we're using a standard par of 72
    return Math.round(handicapIndex * (selectedTee.slope / 113) + (selectedTee.rating - 72));
  };

  const calculateTotals = (scores: (number | null)[]) => {
    const front9 = scores.slice(0, 9).reduce((sum, score) => sum + (score || 0), 0);
    const back9 = scores.slice(9, 18).reduce((sum, score) => sum + (score || 0), 0);
    const total = front9 + back9;
    return { front9, back9, total };
  };

  const addPlayer = () => {
    if (newPlayerName && newPlayerHandicap) {
      const courseHandicap = calculateCourseHandicap(parseFloat(newPlayerHandicap), newPlayerTee);
      const newPlayer: Player = {
        id: Date.now().toString(),
        name: newPlayerName,
        handicapIndex: parseFloat(newPlayerHandicap),
        tee: newPlayerTee,
        team: players.length % 2 === 0 ? 'A' : 'B', // Alternate teams
        courseHandicap,
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

  const updateTeam = (playerId: string, team: 'A' | 'B') => {
    setPlayers(players.map(player => {
      if (player.id === playerId) {
        return { ...player, team };
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

        {/* Course Selection Card */}
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
            <Select value={newPlayerTee} onValueChange={setNewPlayerTee}>
              <SelectTrigger className="md:w-[200px]">
                <SelectValue placeholder="Select tee" />
              </SelectTrigger>
              <SelectContent>
                {selectedCourse.tees.map(tee => (
                  <SelectItem key={tee.color} value={tee.color}>
                    {tee.color} ({tee.rating}/{tee.slope})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                    <th className="py-2 px-4 text-left">Team</th>
                    {selectedCourse.holes.map((hole) => (
                      <th key={hole.number} className="py-2 px-4 text-center">
                        {hole.number}
                      </th>
                    ))}
                    <th className="py-2 px-4 text-center">Out</th>
                    <th className="py-2 px-4 text-center">In</th>
                    <th className="py-2 px-4 text-center">Total</th>
                    <th className="py-2 px-4 text-center">Net</th>
                  </tr>
                  <tr className="border-b">
                    <th className="py-2 px-4 text-left"></th>
                    <th className="py-2 px-4 text-left">Par</th>
                    {selectedCourse.holes.map((hole) => (
                      <th key={`par-${hole.number}`} className="py-2 px-4 text-center text-sm text-muted-foreground">
                        {hole.par}
                      </th>
                    ))}
                    <th className="py-2 px-4 text-center text-sm text-muted-foreground">
                      {selectedCourse.holes.slice(0, 9).reduce((sum, hole) => sum + hole.par, 0)}
                    </th>
                    <th className="py-2 px-4 text-center text-sm text-muted-foreground">
                      {selectedCourse.holes.slice(9, 18).reduce((sum, hole) => sum + hole.par, 0)}
                    </th>
                    <th className="py-2 px-4 text-center text-sm text-muted-foreground">
                      {selectedCourse.holes.reduce((sum, hole) => sum + hole.par, 0)}
                    </th>
                    <th className="py-2 px-4 text-center text-sm text-muted-foreground">-</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player) => {
                    const totals = calculateTotals(player.scores);
                    const netScore = totals.total - player.courseHandicap;
                    
                    return (
                      <tr key={player.id} className="border-b">
                        <td className="py-2 px-4">
                          {player.name} ({player.handicapIndex}) - {player.tee}
                          <div className="text-sm text-muted-foreground">
                            Course Handicap: {player.courseHandicap}
                          </div>
                        </td>
                        <td className="py-2 px-4">
                          <RadioGroup
                            value={player.team}
                            onValueChange={(value: 'A' | 'B') => updateTeam(player.id, value)}
                            className="flex flex-row space-x-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="A" id={`team-a-${player.id}`} />
                              <Label htmlFor={`team-a-${player.id}`}>A</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="B" id={`team-b-${player.id}`} />
                              <Label htmlFor={`team-b-${player.id}`}>B</Label>
                            </div>
                          </RadioGroup>
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
                        <td className="py-2 px-4 text-center font-medium">{totals.front9}</td>
                        <td className="py-2 px-4 text-center font-medium">{totals.back9}</td>
                        <td className="py-2 px-4 text-center font-medium">{totals.total}</td>
                        <td className="py-2 px-4 text-center font-medium">{netScore}</td>
                      </tr>
                    );
                  })}
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
