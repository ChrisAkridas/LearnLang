"use client";
// Types
import type { GetLessonNonNull } from "@/lib/actions";
// External
import Link from "next/link";
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/Alert";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/Drawer";
import { Badge } from "@/components/ui/Badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Check, X } from "lucide-react";
// Internal
import { generateWordsPool } from "@/lib/utils";
import { BKTData } from "@/types/types";

const TIME_INTERVAL = 100;

type Action = {
  type: "CHECK_ANSWER" | "NEXT_WORD";
  payload?: GetLessonNonNull["vocabulary"][0];
  time?: string;
};

type LessonStats = {
  word: GetLessonNonNull["vocabulary"][0];
  timeToComplete?: string;
  answer?: GetLessonNonNull["vocabulary"][0];
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

      const answer = action.payload;
      const correct = state.activeWord.id === answer.id;
      const updatedStats = state.stats.toSpliced(state.activeIndex, 1, {
        ...state.stats[state.activeIndex],
        timeToComplete: action.time,
        answer,
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
  nextLessonId?: string;
}
export default function Multiple({ data, nextLessonId }: MultipleProps) {
  const initialState: State = {
    activeIndex: 0,
    activeWord: data[0],
    showAlert: false,
    stats: data.map((word) => ({ word } as LessonStats)),
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isTicking, setIsTicking] = useState(true);
  const searchParams = useSearchParams();
  const timeRef = useRef(0);

  const activeExercise = searchParams.get("exercise");

  const { activeIndex } = state;
  const activeWordStats = state.stats[activeIndex];
  const maxIndex = data.length - 1;

  useEffect(() => {
    if (state.showAlert && activeIndex >= maxIndex) {
      const data = state.stats.map((it) => {
        return {
          user_id: 1,
          skill_name: "vocabulary",
          correct: it.correct ? 1 : 0,
          problem_id: it.word.id + "_mult",
          duration: Number(it.timeToComplete),
          response_text: it.answer?.greek,
          resource: it.word.english,
        } as BKTData;
      });

      fetch("/api/update_dataset", {
        method: "POST",
        body: JSON.stringify({
          data,
          filename: "trainingDataset.csv",
        }),
      });
    }
  }, [state.showAlert]);

  const pool = useMemo(() => {
    return generateWordsPool(data, activeIndex, 5);
  }, [activeIndex, data]);

  // let time = 0; // in ms

  useEffect(() => {
    let intervalID: NodeJS.Timeout;
    if (isTicking) {
      timeRef.current = 0;
      intervalID = setInterval(() => {
        timeRef.current += TIME_INTERVAL;
      }, TIME_INTERVAL);
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
                state.showAlert === true && word.id === state.stats[activeIndex].answer?.id
                  ? activeWordStats.correct
                    ? "bg-green-500 "
                    : "bg-red-500 text-white"
                  : ""
              } shadow-md`}
              onClick={() => {
                setIsTicking(false);
                dispatch({
                  type: "CHECK_ANSWER",
                  payload: word,
                  time: timeRef.current ? (timeRef.current / 1000).toFixed(2).toString() : undefined,
                });
              }}
            >
              {word.greek}
            </Button>
          ))}
        </div>
      </main>
      {state.showAlert && (
        <Alert variant={`${activeWordStats.correct ? "success" : "destructive"}`} className="mt-10 max-w-2xl mx-auto">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              {activeWordStats.correct ? (
                <Check className="bg-green-500 rounded-full stroke-white p-0.5" />
              ) : (
                <X className="bg-red-500 rounded-full stroke-white p-0.5" />
              )}
              <div>
                <AlertTitle>{activeWordStats.correct ? "Congratulations!" : "Correct answer is:"}</AlertTitle>
                <AlertDescription>{activeWordStats.correct ? "Your answer is correct." : activeWordStats.word.greek}</AlertDescription>
              </div>
            </div>
            {activeIndex < maxIndex && (
              <Button
                className="w-fit self-end hover:text-inherit"
                variant="outline"
                onClick={() => {
                  setIsTicking(true);
                  dispatch({ type: "NEXT_WORD" });
                }}
              >
                Continue
              </Button>
            )}
          </div>
        </Alert>
      )}
      {state.showAlert && activeIndex >= maxIndex && (
        <div className="flex justify-center gap-4 mt-10">
          <Drawer defaultOpen={false}>
            <DrawerTrigger asChild>
              <Button variant="outline">Review Lesson</Button>
            </DrawerTrigger>
            <DrawerContent className="h-3/4">
              <DrawerHeader>
                <DrawerTitle>Summary</DrawerTitle>
                <div className="flex mt-4">
                  <div className="me-2">Correct Answers:</div>
                  <div className="flex gap-1">
                    <span>
                      {state.stats.reduce((sum, currentValue) => {
                        if (currentValue.correct) {
                          return sum + 1;
                        } else {
                          return sum;
                        }
                      }, 0)}
                    </span>
                    <span>/</span>
                    <span>{state.stats.length}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <span>Total time:</span>
                  <span>{state.stats.reduce((sum, currentValue) => sum + Number(currentValue.timeToComplete), 0).toFixed(2)}</span>
                  <span>
                    sec
                    {state.stats.reduce((sum, currentValue) => sum + Number(currentValue.timeToComplete), 0) > 1 ? "s" : null}
                  </span>
                </div>
              </DrawerHeader>
              <div className="mt-4 px-4 grid grid-cols-5 gap-2">
                {state.stats.map((it) => {
                  return (
                    <Card key={it.word.id} className={`${it.correct ? "bg-green-200 border-green-400" : "bg-red-200 border-red-400"} border-2`}>
                      <CardHeader className="relative">
                        <Badge variant="secondary" className="absolute border border-neutral-400 top-1 right-1">
                          {Number(it.timeToComplete).toFixed(2) ?? "NaN"} sec
                          {Number(it.timeToComplete) > 1 ? "s" : null}
                        </Badge>
                        <CardTitle>Word: {it.word.english}</CardTitle>
                        <CardDescription>Answer: {it.answer?.greek}</CardDescription>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            </DrawerContent>
          </Drawer>
          <Link href={nextLessonId ? `${nextLessonId}?exercise=${activeExercise}` : "/"}>
            <Button className="bg-blue-300 text-black hover:bg-blue-400">{nextLessonId ? "Next Lesson" : "Home"}</Button>
          </Link>
        </div>
      )}
    </>
  );
}
