"use server";

// Types
// External
// Internal
import prismaClient from "../../prisma/db";

// import fetchGraphQL from "./fetchGQL";
// import { GET_LESSONS, GET_LESSON } from "@/graphql/queries";

// export async function fetchLessons() {
//   const { lessons } = await fetchGraphQL(GET_LESSONS);
//   return lessons as Lesson[];
// }

// export async function fetchLesson(id: string) {
//   const { lesson } = await fetchGraphQL(GET_LESSON, { id });
//   return lesson as Partial<Lesson>;
// }

export async function getLesson(id: string) {
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
}
export type GetLessonNonNull = NonNullable<Awaited<ReturnType<typeof getLesson>>>;

export async function getLessons() {
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
    return null;
  }
}

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
