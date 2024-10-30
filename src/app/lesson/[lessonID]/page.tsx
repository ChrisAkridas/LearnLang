// Types
// External
// Internal
import prismaClient from "../../../../prisma/db";
import { notFound } from "next/navigation";
import { getLesson } from "@/lib/actions";
import Games from "./components/Games";

// The segments that are not statically generated will return a 404 error
export const dynamicParams = false;

// Generate static segments
export async function generateStaticParams() {
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
  const lesson = await getLesson(lessonID);

  if (!lesson || !lesson.vocabulary || lesson.vocabulary.length === 0)
    notFound();

  return (
    <div className="">
      <h1 className="text-2xl">{lesson.title}</h1>
      <Games data={lesson.vocabulary} />
    </div>
  );
}
