
import { motion } from "framer-motion";
import { useState } from "react";
import { CourseSelector } from "@/components/golf/CourseSelector";
import { AddPlayerForm } from "@/components/golf/AddPlayerForm";
import { ScoreCard } from "@/components/golf/ScoreCard";

// Sample data (we'll move this to a database later)
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

const samplePlayers: Player[] = [
  {
    id: "1",
    name: "John Smith",
    handicapIndex: 8.4,
    tee: "Blue",
    team: 'A',
    courseHandicap: 10,
    scores: [4, 5, 4, 3, 4, 5, 4, 4, 3, 5, 4, 4, 5, 4, 3, 4, 5, 4],
  },
  {
    id: "2",
    name: "Mike Johnson",
    handicapIndex: 12.1,
    tee: "White",
    team: 'A',
    courseHandicap: 14,
    scores: [5, 6, 5, 4, 5, 6, 5, 5, 4, 6, 5, 5, 6, 5, 4, 5, 6, 5],
  },
  {
    id: "3",
    name: "Sarah Williams",
    handicapIndex: 15.7,
    tee: "Red",
    team: 'B',
    courseHandicap: 17,
    scores: [6, 5, 6, 5, 6, 5, 6, 5, 6, 5, 6, 5, 6, 5, 6, 5, 6, 5],
  },
  {
    id: "4",
    name: "David Brown",
    handicapIndex: 10.3,
    tee: "White",
    team: 'B',
    courseHandicap: 12,
    scores: [5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4],
  },
];

const Index = () => {
  const [players, setPlayers] = useState<Player[]>(samplePlayers);
  const [selectedCourse, setSelectedCourse] = useState(sampleCourses[0]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerHandicap, setNewPlayerHandicap] = useState("");
  const [newPlayerTee, setNewPlayerTee] = useState(selectedCourse.tees[0].color);

  const calculateCourseHandicap = (handicapIndex: number, tee: string) => {
    const selectedTee = selectedCourse.tees.find(t => t.color === tee);
    if (!selectedTee) return 0;
    return Math.round(handicapIndex * (selectedTee.slope / 113) + (selectedTee.rating - 72));
  };

  const addPlayer = () => {
    if (newPlayerName && newPlayerHandicap) {
      const courseHandicap = calculateCourseHandicap(parseFloat(newPlayerHandicap), newPlayerTee);
      const newPlayer: Player = {
        id: Date.now().toString(),
        name: newPlayerName,
        handicapIndex: parseFloat(newPlayerHandicap),
        tee: newPlayerTee,
        team: players.length % 2 === 0 ? 'A' : 'B',
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

        <CourseSelector
          courses={sampleCourses}
          selectedCourse={selectedCourse}
          onCourseChange={setSelectedCourse}
        />

        <AddPlayerForm
          tees={selectedCourse.tees}
          newPlayerName={newPlayerName}
          newPlayerHandicap={newPlayerHandicap}
          newPlayerTee={newPlayerTee}
          onNameChange={setNewPlayerName}
          onHandicapChange={setNewPlayerHandicap}
          onTeeChange={setNewPlayerTee}
          onAddPlayer={addPlayer}
        />

        <ScoreCard
          players={players}
          holes={selectedCourse.holes}
          onUpdateScore={updateScore}
          onUpdateTeam={updateTeam}
        />
      </motion.div>
    </div>
  );
};

export default Index;
