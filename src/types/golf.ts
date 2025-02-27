
export interface Player {
  id: string;
  name: string;
  handicapIndex: number;
  tee: string;
  team: "A" | "B";
  courseHandicap: number;
  scores: (number | null)[];
}

export interface Hole {
  number: number;
  par: number;
  handicap: number;
}

export interface Tee {
  color: string;
  rating: number;
  slope: number;
}

export interface Course {
  id: string;
  name: string;
  holes: Hole[];
  tees: Tee[];
}

export interface TeamScores {
  A: { gross: number; net: number };
  B: { gross: number; net: number };
}
