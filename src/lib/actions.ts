"use server";

// Types
// External
import { cache } from "react";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
// Internal
import prismaClient from "../../prisma/db";
import { revalidatePath } from "next/cache";

export const getLesson = cache(async function getLesson(id: string) {
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

    const lessonIds = await getLessonsIds("easy");
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

export async function revalidateCustomPath(path: string, difficulty?: string) {
  const cookieStore = await cookies();
  cookieStore.set("difficulty", difficulty || "easy", { path: "/" });
  console.log("cookieStore: ", cookieStore);
  revalidatePath(path, "page");
}
