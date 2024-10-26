"use client";

// Types
import type { Exercise, ExerciseValue } from "@/types/types";
import { Vocabulary } from "@/graphql/gql_types";
// External
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Multiple } from "./Multiple";

// Internal
const exercises: Record<Exercise, ExerciseValue> = {
  multiple: { value: "multiple", label: "Multiple Choise" },
  fill: { value: "fill", label: "Fill in the blanks" },
  matching: { value: "matching", label: "Matching words" },
};

interface GameProps {
  data: Vocabulary[];
}
export default function Games({ data }: GameProps) {
  const [activeExercise, setActiveExercise] = useState<ExerciseValue>(
    exercises.multiple
  );
  // const [activeIndex, setActiveIndex] = useState<number>(0);

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
      <main className="text-center">
        Selected Exercise is: {activeExercise.label}
        {/* {data.map((it) => {
          return (
            <div key={it.id} className="flex gap-4">
              <div>{it.english}</div>
              <div>{it.greek}</div>
              <div>{it.greeklish}</div>
            </div>
          );
        })} */}
        {/* <div className="flex justify-center mt-10">
          <div>{data[activeIndex].greek}</div>
          <div>{data[activeIndex].english}</div>
          <div>{data[activeIndex].greeklish}</div>
          <button
            className="ms-2 px-4 py-1 bg-blue-200 rounded-sm"
            onClick={() => {
              if (activeIndex >= 0 && activeIndex < data.length - 1) {
                setActiveIndex(activeIndex + 1);
              }
            }}
          >
            Next
          </button>
        </div> */}
      </main>
      {/* <Multiple /> */}
    </>
  );
}
