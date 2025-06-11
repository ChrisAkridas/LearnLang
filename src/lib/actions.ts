"use server";

// Types
// External
import { cache } from "react";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
// Internal
import prismaClient from "../../prisma/db";

export const getLesson = cache(async function getLesson(id: string, difficulty?: string) {
  try {
    const lesson = await prismaClient.lesson.findUnique({
      where: {
        id: id,
      },
      select: {
        title: true,
        lessonNumber: true,
        vocabulary: {
          select: {
            id: true,
            english: true,
            greek: true,
            greeklish: true,
          },
        },
        fillBlanks: {
          select: {
            id: true,
            english: true,
            greek: true,
            pool: true,
            correct: true,
          },
        },
      },
    });

    const lessonIds = (await getLessonsIds(difficulty)).map((it) => it.id);
    return { lesson, lessonIds };
  } catch (error) {
    console.error("Error fetching lesson", error);
    return null;
  }
});
export type GetLessonNonNull = NonNullable<NonNullable<Awaited<ReturnType<typeof getLesson>>>["lesson"]>;
export type GetLessonsIdsNonNull = NonNullable<NonNullable<Awaited<ReturnType<typeof getLesson>>>["lessonIds"]>;

export const getLessons = cache(async (difficulty: string = "easy") => {
  try {
    const lessons = await prismaClient.lesson.findMany({
      select: {
        id: true,
        title: true,
        lessonNumber: true,
        difficulty: true,
      },
      where: {
        difficulty: difficulty,
      },
    });

    return lessons;
  } catch (error) {
    console.error("Error fetching lessons", error);
    notFound();
  }
});

export const getRandomLesson = async (difficulty: string = "easy", currentLessonId: string) => {
  try {
    const lessons = await prismaClient.lesson.findMany({
      where: {
        id: { not: currentLessonId },
        difficulty: difficulty,
      },
      select: {
        title: true,
        lessonNumber: true,
        vocabulary: {
          select: {
            id: true,
            english: true,
            greek: true,
            greeklish: true,
          },
        },
        fillBlanks: {
          select: {
            id: true,
            english: true,
            greek: true,
            pool: true,
            correct: true,
          },
        },
      },
    });

    if (lessons.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * lessons.length);
    return lessons[randomIndex];
  } catch (error) {
    console.error("Error fetching random lesson", error);
    notFound();
  }
};

export async function getLessonsIds(difficulty?: string) {
  try {
    const lessons = await prismaClient.lesson.findMany({
      select: {
        id: true,
      },
      where: difficulty
        ? {
            difficulty: difficulty,
          }
        : undefined,
    });
    return lessons;
  } catch (error) {
    console.error("Error fetching lessons ids", error);
    throw new Error("Failed to fetch lessons ids" + error);
    // return null;
  }
}

export async function getNextLessonId(lessonNumber: number) {
  try {
    const id = await prismaClient.lesson.findFirst({
      where: {
        lessonNumber: lessonNumber + 1,
      },
      select: {
        id: true,
      },
    });

    return id;
  } catch (error) {
    console.error("Error fetching next lesson", error);
    return null;
  }
}

// export async function updateDifficulty(difficulty?: string, cookiesOptions?: ResponseCookie) {
//   const cookieStore = await cookies();
//   cookieStore.set("difficulty", difficulty || "easy", cookiesOptions);
//   console.log("cookieStore: ", cookieStore);
// }

export async function setCookie(name: string, value: string, options?: ResponseCookie) {
  const cookieStore = await cookies();
  cookieStore.set(name, value, options);
  // console.log("cookieStore: ", cookieStore);
}

export async function getCookie(name: string) {
  const cookieStore = await cookies();
  return cookieStore.get(name);
}
