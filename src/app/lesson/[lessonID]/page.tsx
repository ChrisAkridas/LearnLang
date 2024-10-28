// Types
import type { Lesson } from "@/graphql/gql_types";
// External
// Internal
// import { fetchLessons, fetchLesson } from "@/lib/actions";
import Games from "./components/Games";
import { notFound } from "next/navigation";
import prismaClient from "../../../../prisma/db";
// The segments that are not statically generated will return a 404 error
export const dynamicParams = false;

// Generate static segments
export async function generateStaticParams() {
  // const lessons = await fetchLessons();
  const lessons = await prismaClient.lesson.findMany({
    select: {
      id: true,
    },
  });

  if (lessons) {
    return lessons.map((lesson) => ({
      lessonID: lesson.id,
    }));
  } else {
    return [];
  }
}

interface LessonProps {
  params: {
    lessonID: string;
  };
}

export default async function Lesson({ params }: LessonProps) {
  const { lessonID } = params;
  const lesson = await prismaClient.lesson.findUnique({
    where: {
      id: lessonID,
    },
    include: {
      vocabulary: true,
    },
  });
  // const lesson = await fetchLesson(lessonID);
  // if (!lesson || !lesson?.vocabulary) {
  //   return notFound();
  // }

  // console.log("in lesson page", lesson);

  return (
    <div className="flex flex-col gap-4">
      {lessonID}
      <h1 className="text-2xl">{lesson?.title}</h1>
      <Games data={lesson?.vocabulary ?? []} />
    </div>
  );
}
