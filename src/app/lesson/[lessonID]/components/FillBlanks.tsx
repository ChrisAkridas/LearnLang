"use client";

// Types
// External
import { useEffect, useMemo, useReducer, useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/Drawer";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { Check, X } from "lucide-react";
// Internal
import { GetLessonNonNull } from "@/lib/actions";
import { shuffleArray } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { BKTData, BKTRouteBody } from "@/types/types";

const TIME_INTERVAL = 100;

type LessonStats = {
  word: GetLessonNonNull["fillBlanks"][0];
  timeToComplete?: string;
  answer?: string;
  correct?: boolean;
};

type Action = { type: "CHECK_ANSWER" | "NEXT_WORD"; payload?: string; time?: string };

type State = {
  activeIndex: number;
  activeWord: GetLessonNonNull["fillBlanks"][0];
  stats: LessonStats[];
  showAlert: boolean;
};

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "CHECK_ANSWER": {
      const updatedStats = state.stats.toSpliced(state.activeIndex, 1, {
        ...state.stats[state.activeIndex],
        timeToComplete: action.time,
        answer: action.payload,
        correct: state.activeWord.correct === action.payload,
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

interface Props {
  data: GetLessonNonNull["fillBlanks"];
  nextLessonId?: string;
}
export default function FillBlanks({ data, nextLessonId }: Props) {
  const initialState: State = {
    activeIndex: 0,
    activeWord: data[0],
    stats: data.map((word) => ({ word } as LessonStats)),
    showAlert: false,
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isTicking, setIsTicking] = useState(true);
  const searchParams = useSearchParams();

  const activeExercise = searchParams.get("exercise");

  const { activeIndex } = state;
  const activeWordStats = state.stats[activeIndex];
  const maxIndex = data.length - 1;

  const pool = useMemo(() => {
    return shuffleArray(state.activeWord.pool);
  }, [activeIndex]);

  let time = 0; // in ms

  useEffect(() => {
    let intervalID: NodeJS.Timeout;
    if (isTicking) {
      intervalID = setInterval(() => {
        time = time + TIME_INTERVAL;
      }, TIME_INTERVAL);
    }
    return () => {
      clearInterval(intervalID);
    };
  }, [isTicking]);

  useEffect(() => {
    if (state.showAlert && activeIndex >= maxIndex) {
      const data = state.stats.map((it) => {
        return {
          user_id: "",
          skill_name: "vocabulary",
          correct: it.correct ? 1 : 0,
          problem_id: it.word.id + "_fillBlanks",
          duration: Number(it.timeToComplete),
          response_text: it.answer,
          resource: it.word.english,
          multilearn: Number(it.timeToComplete) <= 4.2 ? "fast" : Number(it.timeToComplete) >= 9.6 ? "slow" : "medium",
          multigs: it.word.id + "_fillBlanks",
        } as BKTData;
      });

      fetch("/api/update_dataset", {
        method: "POST",
        body: JSON.stringify({
          data,
        } as BKTRouteBody),
      });

      fetch("/api/bkt", {
        method: "POST",
        body: JSON.stringify({
          data,
        } as BKTRouteBody),
      }).then(async (data) => {
        console.log("on then: ", await data.json());
      });
    }
  }, [state.showAlert]);

  return (
    <>
      <main className="flex flex-col items-center gap-4">
        <div>{state.activeWord.english}</div>
        <div>{state.activeWord.greek}</div>
        <div className="mt-10 flex gap-6 justify-center font-bold">
          {pool.map((word, index) => (
            <Button
              disabled={state.showAlert}
              key={index + "." + word}
              variant="outline"
              className={`font-bold grid grid-cols-1 grid-rows-1 items-center relative ${
                state.showAlert === true && state.stats[state.activeIndex].answer === word
                  ? activeWordStats.correct
                    ? "bg-green-500"
                    : "bg-red-500 text-white"
                  : ""
              }`}
              onClick={() => {
                setIsTicking(false);
                dispatch({
                  type: "CHECK_ANSWER",
                  payload: word,
                  time: time ? (time / 1000).toFixed(2).toString() : undefined,
                });
              }}
            >
              <div className={`col-start-1 row-start-1 absolute size-full z-10`} />
              <div className="col-start-1 row-start-1 h-9 px-4 py-2">{word}</div>
            </Button>
          ))}
        </div>
      </main>
      {state.showAlert && (
        <Alert variant={activeWordStats.correct ? "success" : "destructive"} className="mt-10 max-w-2xl mx-auto">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              {activeWordStats.correct ? (
                <Check className="bg-green-500 rounded-full stroke-white p-0.5" />
              ) : (
                <X className="bg-red-500 rounded-full stroke-white p-0.5" />
              )}
              <div>
                <AlertTitle>{activeWordStats.correct ? "Congratulations!" : "Correct answer is:"}</AlertTitle>
                <AlertDescription>
                  {activeWordStats.correct ? "Your answer is correct." : activeWordStats.word.correct}
                </AlertDescription>
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
                  <span>
                    {state.stats.reduce((sum, currentValue) => sum + Number(currentValue.timeToComplete), 0).toFixed(2)}
                  </span>
                  <span>
                    sec
                    {state.stats.reduce((sum, currentValue) => sum + Number(currentValue.timeToComplete), 0) > 1
                      ? "s"
                      : null}
                  </span>
                </div>
              </DrawerHeader>
              <div className="mt-4 px-4 grid grid-cols-5 gap-2">
                {state.stats.map((it, index) => {
                  return (
                    <Card
                      key={index}
                      className={`${it.correct ? "bg-green-200 border-green-400" : "bg-red-200 border-red-400"} border-2`}
                    >
                      <CardHeader className="relative">
                        <Badge variant="secondary" className="absolute border border-neutral-400 top-1 right-1">
                          {Number(it.timeToComplete).toFixed(2) ?? "NaN"} sec
                          {Number(it.timeToComplete) > 1 ? "s" : null}
                        </Badge>
                        <CardTitle>
                          Phrase: <span className="font-light text-sm">{it.word.greek}</span>
                        </CardTitle>
                        <CardDescription>Answer: {it.answer}</CardDescription>
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
