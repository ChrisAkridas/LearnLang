"use client";
// Types
import type { GetLessonNonNull } from "@/lib/actions";
// External
import Link from "next/link";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/Drawer";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { twMerge } from "tailwind-merge";
import { cva, type VariantProps } from "cva";
// Internal
import { shuffleArray } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useReducer } from "react";
import { useSearchParams } from "next/navigation";

const sectionCommonCls = "flex flex-col gap-2";
interface MatchingProps {
  data: GetLessonNonNull["vocabulary"];
  nextLessonId?: string;
}

type Stat = {
  word: GetLessonNonNull["vocabulary"][0];
  isCorrect: boolean;
  time: string | null;
  wrongAnswers: string[];
};

type State = {
  selectedGreekWord?: GetLessonNonNull["vocabulary"][0] | null;
  selectedEnglishWord?: GetLessonNonNull["vocabulary"][0] | null;
  stats: Stat[];
  flashError?: {
    ids: [string, string];
    flash: boolean;
  };
};

type Action = {
  type: "SELECT_GREEK_WORD" | "SELECT_ENG_WORD" | "RESET_SELECTIONS" | "RESET_ERROR" | "VALIDATE";
  payload?: GetLessonNonNull["vocabulary"][0];
  time?: string;
};

function manageTimer() {
  let time = 0;
  let intervalId: NodeJS.Timeout;

  return (command: "START_TIMER" | "STOP_TIMER") => {
    if (command === "START_TIMER") {
      intervalId = setInterval(() => {
        time += 100; // in ms
      }, 100);
    }
    if (command === "STOP_TIMER") {
      clearInterval(intervalId);
      const elapsedTime = time;

      time = 0;
      return elapsedTime;
    }
  };
}

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "SELECT_GREEK_WORD": {
      return { ...state, selectedGreekWord: action.payload };
    }
    case "SELECT_ENG_WORD": {
      return { ...state, selectedEnglishWord: action.payload };
    }
    case "RESET_SELECTIONS": {
      return { ...state, selectedGreekWord: null, selectedEnglishWord: null };
    }
    case "RESET_ERROR": {
      return { ...state, flashError: undefined };
    }
    case "VALIDATE": {
      if (state.selectedGreekWord == null || state.selectedEnglishWord == null) {
        return state;
      }
      const foundIndex = state.stats.findIndex((it) => it.word.id === state.selectedEnglishWord?.id);
      if (state.selectedGreekWord.id === state.selectedEnglishWord.id) {
        const updatedStats = state.stats.toSpliced(foundIndex, 1, {
          ...state.stats[foundIndex],
          isCorrect: true,
          time: (Number(state.stats[foundIndex].time) + Number(action.time)).toString(),
        } as Stat);
        return {
          selectedGreekWord: null,
          selectedEnglishWord: null,
          stats: updatedStats,
          flashError: undefined,
        } as State;
      } else {
        const updatedStats = state.stats.toSpliced(foundIndex, 1, {
          ...state.stats[foundIndex],
          wrongAnswers: [...state.stats[foundIndex].wrongAnswers, state.selectedGreekWord.id],
          time: (Number(state.stats[foundIndex].time) + Number(action.time)).toString(),
        });
        return {
          selectedEnglishWord: null,
          selectedGreekWord: null,
          stats: updatedStats,
          flashError: {
            ids: [state.selectedEnglishWord.english, state.selectedGreekWord.greek],
            flash: true,
          },
        } as State;
      }
    }
  }
}

export default function Matching({ data, nextLessonId }: MatchingProps) {
  const [state, dispatch] = useReducer(reducer, {
    selectedEnglishWord: null,
    selectedGreekWord: null,
    stats: data.map((it) => ({
      word: it,
      isCorrect: false,
      time: null,
      wrongAnswers: [],
    })),
    flashError: undefined,
  } as State);
  const searchParams = useSearchParams();

  const activeExercise = searchParams.get("exercise");
  const showDialog = state.stats.every((it) => it.isCorrect === true);
  const timeHandler = useCallback(manageTimer(), []);

  const greekWords = useMemo(() => {
    return shuffleArray(data.map((it) => it));
  }, [data]);

  const englishWords = useMemo(() => {
    return shuffleArray(data.map((it) => it));
  }, [data]);

  if (state.selectedEnglishWord && state.selectedGreekWord) {
    const time = timeHandler("STOP_TIMER");
    dispatch({
      type: "VALIDATE",
      time: time ? (time / 1000).toFixed(2).toString() : undefined,
    });
  }

  useEffect(() => {
    if (state.flashError?.flash) {
      const timer = setTimeout(() => {
        dispatch({ type: "RESET_ERROR" });
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [state.flashError]);

  return (
    <>
      <main>
        <div className="mx-auto flex w-1/4 justify-between">
          <section className={sectionCommonCls}>
            {englishWords.map((it) => {
              const isCorrect = state.stats.find((w) => w.word.id === it.id)?.isCorrect;
              const isSelected = state.selectedEnglishWord && state.selectedEnglishWord.id === it.id ? true : false;
              return (
                <Word
                  key={`${it.id}-eng`}
                  isSelected={isSelected}
                  isCorrect={isCorrect}
                  isWrong={state.flashError?.ids.includes(it.english)}
                  onClick={() => {
                    if (state.selectedEnglishWord && state.selectedEnglishWord.id === it.id) return;
                    if (state.selectedEnglishWord == null && state.selectedGreekWord == null) {
                      timeHandler("START_TIMER");
                    } else if (state.selectedEnglishWord && state.selectedEnglishWord.id !== it.id) {
                      timeHandler("STOP_TIMER");
                      timeHandler("START_TIMER");
                    }

                    dispatch({
                      type: "SELECT_ENG_WORD",
                      payload: it,
                    });
                  }}
                >
                  {it.english}
                </Word>
              );
            })}
          </section>
          <section className={sectionCommonCls}>
            {greekWords.map((it) => {
              const isCorrect = state.stats.find((w) => w.word.id === it.id)?.isCorrect;
              const isSelected = state.selectedGreekWord && state.selectedGreekWord.id === it.id ? true : false;

              return (
                <Word
                  key={`${it.id}-greek`}
                  isSelected={isSelected}
                  isCorrect={isCorrect}
                  isWrong={state.flashError?.ids.includes(it.greek)}
                  onClick={() => {
                    if (state.selectedGreekWord && state.selectedGreekWord.id === it.id) return;
                    if (state.selectedEnglishWord == null && state.selectedGreekWord == null) {
                      timeHandler("START_TIMER");
                    } else if (state.selectedGreekWord && state.selectedGreekWord.id !== it.id) {
                      timeHandler("STOP_TIMER");
                      timeHandler("START_TIMER");
                    }
                    dispatch({
                      type: "SELECT_GREEK_WORD",
                      payload: it,
                    });
                  }}
                >
                  {it.greek}
                </Word>
              );
            })}
          </section>
        </div>
      </main>
      {showDialog && (
        <div className="flex justify-center gap-4 mt-10">
          <Drawer defaultOpen={false}>
            <DrawerTrigger id="trigger" asChild>
              <Button variant="outline">Review Lesson</Button>
            </DrawerTrigger>
            <DrawerContent className="h-3/4">
              <DrawerHeader>
                <DrawerTitle>Summary</DrawerTitle>
                <div className="flex gap-1">
                  <span>Total time:</span>
                  <span>{state.stats.reduce((sum, currentValue) => sum + Number(currentValue.time), 0).toFixed(2)}</span>
                  <span>
                    sec
                    {state.stats.reduce((sum, currentValue) => sum + Number(currentValue.time), 0) > 1 ? "s" : null}
                  </span>
                </div>
              </DrawerHeader>
              <div className="px-4 mt-4 grid grid-cols-5 gap-2">
                {state.stats.map((it) => {
                  return (
                    <Card
                      key={it.word.id}
                      className={`${it.isCorrect ? "bg-green-200 border-green-400" : "bg-red-200 border-red-400"} border-2`}
                    >
                      <CardHeader className="relative">
                        <Badge variant="secondary" className="absolute border border-neutral-400 top-1 right-1">
                          {Number(it.time).toFixed(2) ?? NaN} sec
                          {Number(it.time) > 1 ? "s" : null}
                        </Badge>
                        <CardTitle>Word: {it.word.english}</CardTitle>
                        <CardDescription>Correct answer: {it.word.greek}</CardDescription>
                        <CardDescription>
                          Wrong answer{it.wrongAnswers.length > 1 ? "s" : ""}({it.wrongAnswers.length}):{" "}
                          {it.wrongAnswers.length > 0
                            ? it.wrongAnswers.map((wrongAnswerId, index) => {
                                return (
                                  <span key={index}>
                                    {state.stats.find((w) => w.word.id === wrongAnswerId)?.word.greek}
                                    {index + 1 < it.wrongAnswers.length ? ", " : null}
                                  </span>
                                );
                              })
                            : " - "}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>

              {/* <DrawerFooter className="flex-row justify-center">
              <Link href={nextLessonId ? `${nextLessonId}?exercise=${activeExercise}` : "/"}>
                <Button className="bg-blue-300 text-black hover:bg-blue-400">{nextLessonId ? "Next Lesson" : "Home"}</Button>
              </Link>
              <DrawerClose>
                <Button variant="outline" className="bg-slate-300 hover:bg-slate-400">
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter> */}
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

const wordStyles = cva({
  base: "border border-slate-300 px-2  py-1 shadow-sm hover:shadow-md hover:cursor-pointer hover:bg-slate-100 rounded-md text-center",
  variants: {
    isSelected: {
      true: "bg-blue-200 hover:bg-blue-200 border-blue-400",
      false: "",
    },
    isCorrect: {
      true: "bg-green-200 border-green-400 cursor-default pointer-events-none transition-opacity opacity-50 duration-1000",
    },
    isWrong: {
      true: "bg-red-200 border-red-400 hover:bg-red-200 bounceZ",
    },
  },
  compoundVariants: [
    {
      isSelected: true,
      isCorrect: true,
      className: "bg-green-200 border-green-300",
    },
  ],
});

interface WordProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof wordStyles> {}

function Word({ isSelected, isCorrect, className, isWrong, ...props }: WordProps) {
  return <button className={twMerge(wordStyles({ isSelected, isCorrect, isWrong }), className)} {...props} />;
}
