"use client";

// Types
import type { Exercise, ExerciseValue } from "@/types/types";
import type { GetLessonNonNull } from "@/lib/actions";
// External
import { Suspense, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
// Internal
import Multiple from "./Multiple";
import FillBlanks from "./FillBlanks";
import Matching from "./Matching";

interface GameProps {
  data: GetLessonNonNull;
  nextLessonId?: string;
}
export default function Games({ data, nextLessonId }: GameProps) {
  const exercises = useMemo(() => {
    return {
      multiple: {
        value: "multiple",
        label: "Multiple Choise",
        content: <Multiple data={data.vocabulary} nextLessonId={nextLessonId} />,
      },
      matching: {
        value: "matching",
        label: "Matching words",
        content: <Matching data={data.vocabulary} nextLessonId={nextLessonId} />,
      },
      fillgaps: {
        value: "fillgaps",
        label: "Fill in the blanks",
        content: <FillBlanks data={data.fillBlanks} nextLessonId={nextLessonId} />,
      },
    } as Record<Exercise, ExerciseValue>;
  }, [data]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const activeExercise = (searchParams.get("exercise") ?? "multiple") as Exercise;

  useEffect(() => {
    router.push(`?exercise=${activeExercise}`, {
      scroll: false,
    });
  }, []);
  return (
    <>
      <Select
        value={activeExercise}
        onValueChange={(value) => {
          router.push(`?exercise=${value}`, {
            scroll: false,
          });
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
      <section>
        <Suspense fallback={<div>Loading...</div>}>{exercises[activeExercise].content}</Suspense>
      </section>
    </>
  );
}
