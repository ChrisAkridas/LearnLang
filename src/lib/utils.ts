// Types
// External
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
// Internal

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateWordsPool<K>(
  array: K[],
  activeIndex: number,
  poolSize: number
) {
  if (poolSize >= array.length || poolSize <= 1) {
    return shuffleArray(array);
  }

  let pool = new Array(array[activeIndex]);
  // console.log(pool);

  let wrongAnswers = array.toSpliced(activeIndex, 1);

  wrongAnswers = shuffleArray(wrongAnswers);
  // console.log(wrongAnswers);
  for (let i = 0; i <= poolSize - 2; i++) {
    pool.push(wrongAnswers[i]);
  }
  return shuffleArray(pool);
}

export function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    // Generate a random index between 0 and i
    const j = Math.floor(Math.random() * (i + 1));

    // Swap elements at index i and j
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// export function checkValidity(activeWord) {}
