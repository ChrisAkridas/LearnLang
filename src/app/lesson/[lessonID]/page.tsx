// Types
// External
import { notFound } from "next/navigation";
// Internal
import { getLessonsIds, getLesson, getNextLessonId } from "@/lib/actions";
import Games from "./components/Games";

// The segments that are not statically generated will return a 404 error
export const dynamicParams = false;

// Generate static segments
export async function generateStaticParams() {
  const lessons = await getLessonsIds();
  if (!lessons) notFound();

  return lessons.map((lesson) => ({
    lessonID: lesson.id,
  }));
}

interface LessonProps {
  params: {
    lessonID: string;
  };
}

export default async function Lesson({ params }: LessonProps) {
  const { lessonID } = await params;
  const lesson = await getLesson(lessonID);
  if (!lesson) notFound();

  const nextIdData = await getNextLessonId(lesson.lessonNumber);
  let nextLessonId = "";
  if (nextIdData) nextLessonId = nextIdData.id;

  return (
    <div>
      <h1 className="text-2xl">{lesson.title}</h1>
      <Games data={lesson.vocabulary} nextLessonId={nextLessonId} />
    </div>
  );
}
