export type Exercise = "multiple" | "fill" | "matching";

export type ExerciseValue = {
  value: Exercise;
  label: string;
  content: React.ReactNode;
};
