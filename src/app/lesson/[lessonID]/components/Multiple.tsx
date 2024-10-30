"use client";
// Types
import type { GetLessonNonNull } from "@/lib/actions";
// External
import { Button } from "@/components/ui/Button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/Alert";
import { Check } from "lucide-react";
import { useMemo, useReducer, useState } from "react";
// Internal
import { generateWordsPool } from "@/lib/utils";

type Action = {
  type: string;
  payload: GetLessonNonNull["vocabulary"][0];
};

type LessonStats = GetLessonNonNull["vocabulary"][0] & {
  correct: boolean;
  answerId: string;
};

type State = {
  activeIndex: number;
  activeWord: GetLessonNonNull["vocabulary"][0];
  stats: LessonStats[];
  showAlert: boolean;
};

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "CHECK_ANSWER": {
      const answer = action.payload.id;
      const correct = state.activeWord.id === answer;
      const stats = [
        ...state.stats,
        { ...state.activeWord, correct, answerId: action.payload.id },
      ];
      return {
        ...state,
        stats,
        showAlert: true,
      };
    }
    default:
      return state;
  }
}

interface MultipleProps {
  data: GetLessonNonNull["vocabulary"];
}
export default function Multiple({ data }: MultipleProps) {
  const [state, dispatch] = useReducer(reducer, {
    activeIndex: 0,
    activeWord: data[0],
    showAlert: false,
    stats: [],
  });
  const { activeIndex } = state;

  console.log(state);

  const maxIndex = data.length - 1;
  const pool = useMemo(() => {
    return generateWordsPool(data, activeIndex, 5);
  }, [activeIndex]);

  return (
    <>
      <main className="flex flex-col gap-12 mt-12 items-center">
        <h2>{state.activeWord.english}</h2>
        <div className="flex gap-2 ">
          {pool.map((word) => (
            <Button
              disabled={state.showAlert}
              key={word.id}
              variant="outline"
              className={`${
                state.showAlert === true &&
                word.id === state.stats[activeIndex].answerId
                  ? state.stats[activeIndex].correct
                    ? "bg-green-500"
                    : "bg-red-500 text-white"
                  : ""
              }`}
              onClick={() => {
                dispatch({ type: "CHECK_ANSWER", payload: word });
              }}
            >
              {word.greek}
            </Button>
          ))}
        </div>
      </main>

      {state.showAlert && (
        <Alert className="mt-10 max-w-2xl mx-auto">
          <Check className="size-4 " />
          <div className="flex justify-between">
            <div>
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                You can add components to your app using the cli.
              </AlertDescription>
            </div>
            <Button
              disabled={activeIndex === maxIndex}
              className="w-fit self-end"
              variant="outline"
              onClick={() => {}}
            >
              Continue
            </Button>
          </div>
        </Alert>
      )}
    </>
  );
}
