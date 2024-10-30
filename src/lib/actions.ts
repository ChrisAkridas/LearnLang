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
        vocabulary: {
          select: {
            id: true,
            english: true,
            greek: true,
            greeklish: true,
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
