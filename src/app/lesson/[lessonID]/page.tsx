// Types
type Params = import("next/dist/server/request/params").Params;

// External
import { notFound } from "next/navigation";
import Link from "next/link";
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
  params: Promise<Params>;
}
export default async function Lesson({ params }: LessonProps) {
  const { lessonID } = await params;
  const lesson = await getLesson(lessonID as string);
  if (!lesson) notFound();

  const nextIdData = await getNextLessonId(lesson.lessonNumber);
  let nextLessonId: string | undefined = undefined;
  if (nextIdData) nextLessonId = nextIdData.id;

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl">{lesson.title}</h1>
        <Link href="/" className="hover:underline">
          Home
        </Link>
      </div>
      <Games data={lesson} nextLessonId={nextLessonId} />
    </>
  );
}
