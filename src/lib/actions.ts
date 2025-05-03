"use server";

// Types
// External
import { cache } from "react";
import { notFound } from "next/navigation";
// Internal
import prismaClient from "../../prisma/db";

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
    return lesson;
  } catch (error) {
    console.error("Error fetching lesson", error);
    return null;
  }
});
export type GetLessonNonNull = NonNullable<Awaited<ReturnType<typeof getLesson>>>;

export const getLessons = cache(async () => {
  try {
    const lessons = await prismaClient.lesson.findMany({
      select: {
        id: true,
        title: true,
        lessonNumber: true,
      },
    });

    return lessons;
  } catch (error) {
    console.error("Error fetching lessons", error);
    notFound();
  }
});

export async function getLessonsIds() {
  try {
    const lessons = await prismaClient.lesson.findMany({
      select: {
        id: true,
      },
    });
    return lessons;
  } catch (error) {
    console.error("Error fetching lessons ids", error);
    return null;
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
