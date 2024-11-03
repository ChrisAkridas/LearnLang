"use client";
// Types
import type { GetLessonNonNull } from "@/lib/actions";
// External
import { Button } from "@/components/ui/Button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/Alert";
import { Check, X } from "lucide-react";
import { useEffect, useMemo, useReducer, useState } from "react";
// Internal
import { generateWordsPool } from "@/lib/utils";

type Action = {
  type: "CHECK_ANSWER" | "NEXT_WORD";
  payload?: GetLessonNonNull["vocabulary"][0];
  time?: string;
};

type LessonStats = {
  word: GetLessonNonNull["vocabulary"][0];
  timeToComplete?: string;
  answerId?: string;
  correct?: boolean;
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
      if (action.payload === undefined) return state;
      console.log("in the dispatcher", action);

      const answer = action.payload.id;
      const correct = state.activeWord.id === answer;
      const updatedStats = state.stats.toSpliced(state.activeIndex, 1, {
        ...state.stats[state.activeIndex],
        timeToComplete: action.time,
        answerId: answer,
        correct,
      });
      return {
        ...state,
        stats: updatedStats,
        showAlert: true,
      } as State;
    }
    case "NEXT_WORD": {
      const nextIndex = state.activeIndex + 1;
      return {
        ...state,
        activeIndex: nextIndex,
        activeWord: state.stats[nextIndex].word,
        showAlert: false,
      } as State;
    }
    default:
      return state;
  }
}

interface MultipleProps {
  data: GetLessonNonNull["vocabulary"];
}
export default function Multiple({ data }: MultipleProps) {
  const initialState: State = {
    activeIndex: 0,
    activeWord: data[0],
    showAlert: false,
    stats: data.map((word) => ({ word } as LessonStats)),
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isTicking, setIsTicking] = useState(true);

  console.log(state);
  const { activeIndex } = state;
  const activeWordStats = state.stats[activeIndex];
  const maxIndex = data.length - 1;

  const pool = useMemo(() => {
    return generateWordsPool(data, activeIndex, 5);
  }, [activeIndex, data]);

  let time = 0;

  useEffect(() => {
    let intervalID: NodeJS.Timeout;
    if (isTicking) {
      intervalID = setInterval(() => {
        time++;
        console.log(time);
      }, 1000);
    }
    return () => {
      clearInterval(intervalID);
    };
  }, [isTicking]);

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
                state.showAlert === true && word.id === activeWordStats.answerId
                  ? activeWordStats.correct
                    ? "bg-green-500 "
                    : "bg-red-500 text-white"
                  : ""
              } shadow-md`}
              onClick={() => {
                console.log("You select: ", word);
                setIsTicking(false);
                dispatch({
                  type: "CHECK_ANSWER",
                  payload: word,
                  time: time.toString(),
                });
              }}
            >
              {word.greek}
            </Button>
          ))}
        </div>
      </main>

      {state.showAlert && (
        <Alert
          variant={`${activeWordStats.correct ? "success" : "destructive"}`}
          className="mt-10 max-w-2xl mx-auto"
        >
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              {activeWordStats.correct ? (
                <Check className="bg-green-500 rounded-full stroke-white p-0.5" />
              ) : (
                <X className="bg-red-500 rounded-full stroke-white p-0.5" />
              )}
              <div>
                <AlertTitle>
                  {activeWordStats.correct
                    ? "Congratulations!"
                    : "Correct answer is:"}
                </AlertTitle>
                <AlertDescription>
                  {activeWordStats.correct
                    ? "Your answer is correct."
                    : activeWordStats.word.greek}
                </AlertDescription>
              </div>
            </div>
            <Button
              disabled={activeIndex === maxIndex}
              className="w-fit self-end"
              variant="outline"
              onClick={() => {
                setIsTicking(true);
                dispatch({ type: "NEXT_WORD" });
              }}
            >
              Continue
            </Button>
          </div>
        </Alert>
      )}
    </>
  );
}
