"use client";

// Types
import type { Exercise, ExerciseValue } from "@/types/types";
import type { GetLessonNonNull } from "@/lib/actions";
// External
import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
// Internal
import Multiple from "./Multiple";
// import FillGaps from "./FillGaps";
// import Matching from "./Matching";

interface GameProps {
  data: GetLessonNonNull["vocabulary"];
  nextLessonId: string;
}
export default function Games({ data, nextLessonId }: GameProps) {
  const exercises = useMemo(() => {
    return {
      multiple: {
        value: "multiple",
        label: "Multiple Choise",
        content: <Multiple data={data} nextLessonId={nextLessonId} />,
      },
      fill: {
        value: "fill",
        label: "Fill in the blanks",
        // TODO: Create FillGaps component
        content: (
          <div className="mx-auto w-fit">Fill in the blanks component</div>
        ),
      },
      matching: {
        value: "matching",
        label: "Matching words",
        content: <div className="mx-auto w-fit">Matching words component</div>, // TODO: Create Matching component
      },
    } as Record<Exercise, ExerciseValue>;
  }, [data]);

  const [activeExercise, setActiveExercise] = useState<ExerciseValue>(
    exercises.multiple
  );
  return (
    <>
      <Select
        value={activeExercise.value}
        onValueChange={(value) => {
          setActiveExercise(exercises[value as Exercise]);
        }}
      >
        <SelectTrigger className="w-fit">
          <SelectValue placeholder="Choose type of exercise" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {Object.keys(exercises).map((it) => {
              return (
                <SelectItem key={it} value={it}>
                  {exercises[it as Exercise].label}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
      <section>{activeExercise.content}</section>
    </>
  );
}
