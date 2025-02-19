export type Exercise = "multiple" | "fillgaps" | "matching";

export type ExerciseValue = {
  value: Exercise;
  label: string;
  content: React.ReactNode;
};
