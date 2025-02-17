"use client";

// Types
// External
import { useMemo, useReducer } from "react";
// Internal
import { Button } from "@/components/ui/Button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { GetLessonNonNull } from "@/lib/actions";
import { shuffleArray } from "@/lib/utils";
import { Check, X } from "lucide-react";

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
      console.log(action.payload);

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
      };
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

  const { activeIndex } = state;
  const activeWordStats = state.stats[activeIndex];
  const maxIndex = data.length - 1;

  // const [selectedWord, setSelectedWord] = useState<string | null>(null);
  console.log(state);

  const pool = useMemo(() => {
    return shuffleArray(state.activeWord.pool);
  }, [activeIndex]);

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
                dispatch({ type: "CHECK_ANSWER", payload: word });
                // setSelectedWord(word);
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
                className="w-fit self-end"
                variant="outline"
                onClick={() => {
                  // setIsTicking(true);
                  dispatch({ type: "NEXT_WORD" });
                }}
              >
                Continue
              </Button>
            )}
          </div>
        </Alert>
      )}
      {/* <Button onClick={() => dispatch({ type: "NEXT_WORD" })}>Continue</Button> */}
    </>
  );
}
