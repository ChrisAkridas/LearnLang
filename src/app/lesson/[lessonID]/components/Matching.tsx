"use client";
// Types
import type { GetLessonNonNull } from "@/lib/actions";
// External
import { twMerge } from "tailwind-merge";
import { cva, type VariantProps } from "cva";
// Internal
import { shuffleArray } from "@/lib/utils";
import { useMemo, useReducer } from "react";
import { log } from "console";

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
};

type Action = {
  type:
    | "SELECT_GREEK_WORD"
    | "SELECT_ENG_WORD"
    | "RESET_SELECTIONS"
    | "VALIDATE";
  payload?: GetLessonNonNull["vocabulary"][0];
  time?: string;
};

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
    case "VALIDATE": {
      if (
        state.selectedGreekWord == null ||
        state.selectedEnglishWord == null
      ) {
        return state;
      }
      const foundIndex = state.stats.findIndex(
        (it) => it.word.id === state.selectedGreekWord?.id
      );
      if (state.selectedGreekWord.id === state.selectedEnglishWord.id) {
        const updatedStats = state.stats.toSpliced(foundIndex, 1, {
          ...state.stats[foundIndex],
          isCorrect: true,
        } as Stat);
        return {
          selectedGreekWord: null,
          selectedEnglishWord: null,
          stats: updatedStats,
        };
      } else {
        console.log("is Wrong...");
        const updatedWord = state.stats.find(
          (it) => it.word.id === state.selectedGreekWord?.id
        );
        updatedWord?.wrongAnswers.push(state.selectedEnglishWord.id);
        const updatedStats = state.stats.toSpliced(foundIndex, 1, updatedWord!);
        return {
          selectedEnglishWord: null,
          selectedGreekWord: null,
          stats: updatedStats,
        };
      }
    }
  }
}

const sectionCommonCls = "flex flex-col gap-2";

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
  });

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

  return (
    <main>
      <div className="mx-auto flex w-1/4 justify-between">
        <section className={sectionCommonCls}>
          {greekWords.map((it) => {
            const isCorrect = state.stats.find(
              (w) => w.word.id === it.id
            )?.isCorrect;
            const isSelected =
              state.selectedGreekWord && state.selectedGreekWord.id === it.id
                ? true
                : false;

            console.log(isCorrect);
            return (
              <Word
                key={it.id}
                isSelected={isSelected}
                isCorrect={isCorrect}
                onClick={() =>
                  dispatch({ type: "SELECT_GREEK_WORD", payload: it })
                }
              >
                {it.greek}
              </Word>
            );
          })}
        </section>
        <section className={sectionCommonCls}>
          {englishWords.map((it) => {
            const isCorrect = state.stats.find(
              (w) => w.word.id === it.id
            )?.isCorrect;

            return (
              <Word
                key={it.id}
                isSelected={
                  state.selectedEnglishWord &&
                  state.selectedEnglishWord.id === it.id
                    ? true
                    : false
                }
                isCorrect={isCorrect}
                onClick={() =>
                  dispatch({ type: "SELECT_ENG_WORD", payload: it })
                }
              >
                {it.english}
              </Word>
            );
          })}
        </section>
      </div>
    </main>
  );
}

const wordStyles = cva({
  base: "border border-slate-300 px-2 transition-colors py-1 shadow-sm hover:shadow-md hover:cursor-pointer hover:bg-slate-100 rounded-md text-center",
  variants: {
    isSelected: {
      true: "bg-blue-200 hover:bg-blue-200 border-blue-400",
      false: "",
    },
    isCorrect: {
      true: "bg-green-200 border-green-400 cursor-default pointer-events-none transition-opacity opacity-50 duration-1000",
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

interface WordProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof wordStyles> {}
function Word({ isSelected, isCorrect, className, ...props }: WordProps) {
  return (
    <button
      className={twMerge(wordStyles({ isSelected, isCorrect }), className)}
      {...props}
    />
  );
}
