// Types
type Params = import("next/dist/server/request/params").Params;

// External
import { notFound } from "next/navigation";
import Link from "next/link";
// Internal
import { getLesson } from "@/lib/actions";
import Games from "./components/Games";
import { cookies } from "next/headers";

// The segments that are not statically generated will return a 404 error
// export const dynamicParams = false;

// // Generate static segments
// export async function generateStaticParams() {
//   const lessons = await getLessons();

//   return lessons.map((lesson) => ({
//     lessonID: lesson.id,
//   }));
// }

interface LessonProps {
  params: Promise<Params>;
}
export default async function Lesson({ params }: LessonProps) {
  const cookieStore = await cookies();
  const difficulty = cookieStore.get("difficulty")?.value;
  const { lessonID } = await params;
  const result = await getLesson(lessonID as string, difficulty);
  if (!result) notFound();
  const { lesson, lessonIds } = result;
  if (!lesson) notFound();

  const nextLessonIdIndex = lessonIds.findIndex((it) => it === lessonID) + 1;
  const nextLessonId = nextLessonIdIndex === -1 ? undefined : lessonIds[nextLessonIdIndex];

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
