export type Exercise = "multiple" | "fillgaps" | "matching";

export type ExerciseValue = {
  value: Exercise;
  label: string;
  content: React.ReactNode;
};

export interface BKTData {
  user_id: number;
  skill_name: string;
  correct: number;
  problem_id: string;
  duration: number;
  response_text: string;
  resource: string;
}

export interface BKTRouteBody {
  data: BKTData[];
  filename?: string;
}
