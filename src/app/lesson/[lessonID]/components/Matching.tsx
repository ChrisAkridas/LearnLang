"use client";
// Types
import type { GetLessonNonNull } from "@/lib/actions";
// External
import { twMerge } from "tailwind-merge";
import { cva, type VariantProps } from "cva";
// Internal
import { shuffleArray } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useReducer } from "react";

const sectionCommonCls = "flex flex-col gap-2";
interface MatchingProps {
  data: GetLessonNonNull["vocabulary"];
  nextLessonId: string;
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
  startTimer?: () => void;
  clearTimer?: () => number;
};
function manageTimer() {
  let time = 0;
  let intervalId: NodeJS.Timeout;

  console.log("in manageTimer => time: ", time);

  return (command: "START_TIMER" | "STOP_TIMER") => {
    if (command === "START_TIMER") {
      intervalId = setInterval(() => {
        time++;
        console.log("time: ", time);
      }, 1000);
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
      const foundIndex = state.stats.findIndex((it) => it.word.id === state.selectedGreekWord?.id);
      if (state.selectedGreekWord.id === state.selectedEnglishWord.id) {
        const updatedStats = state.stats.toSpliced(foundIndex, 1, {
          ...state.stats[foundIndex],
          isCorrect: true,
        } as Stat);
        return {
          selectedGreekWord: null,
          selectedEnglishWord: null,
          stats: updatedStats,
          flashError: undefined,
        } as State;
      } else {
        console.log("is Wrong...");
        const updatedWord = state.stats.find((it) => it.word.id === state.selectedGreekWord?.id);
        updatedWord?.wrongAnswers.push(state.selectedEnglishWord.id);
        const updatedStats = state.stats.toSpliced(foundIndex, 1, updatedWord!);
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

  const timeDispatcher = useCallback(manageTimer(), []);

  console.log("state: ", state);

  const greekWords = useMemo(() => {
    return shuffleArray(data.map((it) => it));
  }, [data]);

  const englishWords = useMemo(() => {
    return shuffleArray(data.map((it) => it));
  }, [data]);

  if (state.selectedEnglishWord && state.selectedGreekWord) {
    dispatch({ type: "VALIDATE" });
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
    <main>
      <div className="mx-auto flex w-1/4 justify-between">
        <section className={sectionCommonCls}>
          {englishWords.map((it) => {            const isCorrect = state.stats.find((w) => w.word.id === it.id)?.isCorrect;
            const isSelected = state.selectedEnglishWord && state.selectedEnglishWord.id === it.id ? true : false;
            return (
              <Word
                key={it.id}
                isSelected={isSelected}
                isCorrect={isCorrect}
                isWrong={state.flashError?.ids.includes(it.english)}
                onClick={() => manageTimer()dispatch({ type: "SELECT_ENG_WORD", payload: it })}
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

            console.log(isCorrect);
            return (
              <Word
                key={it.id}
                isSelected={isSelected}
                isCorrect={isCorrect}
                isWrong={state.flashError?.ids.includes(it.greek)}
                onClick={() => dispatch({ type: "SELECT_GREEK_WORD", payload: it })}
              >
                {it.greek}
              </Word>
            );
          })}
        </section>
        <button
          onClick={() => {
            const result = timeDispatcher("START_TIMER");
          }}
        >
          Increase time(+)
        </button>
        <button
          onClick={() => {
            const elapsedTime = timeDispatcher("STOP_TIMER");
            console.log("elapsedTime: ", elapsedTime);
          }}
        >
          Clear time
        </button>
      </div>
    </main>
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
