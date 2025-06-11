// Types
type Params = import("next/dist/server/request/params").Params;

// External
import { notFound } from "next/navigation";
import Link from "next/link";
// Internal
import { Badge } from "@/components/ui/Badge";
import Games from "../lesson/[lessonID]/components/Games";
import { getLesson, getRandomLesson } from "@/lib/actions";
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
  const difficulty = cookieStore.get("difficulty")?.value || "easy";
  const prevLessonId = cookieStore.get("prevLessonId")?.value || "";
  // console.log("rendering...");

  const randomLesson = await getRandomLesson(difficulty, prevLessonId);
  // console.log("randomLesson", randomLesson);

  if (!randomLesson) notFound();

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl flex items-center gap-2">
          {randomLesson.title}{" "}
          <Badge
            className={
              difficulty === "easy"
                ? "bg-blue-400 hover:bg-blue-400"
                : difficulty === "normal"
                ? "bg-yellow-400 hover:bg-yellow-400"
                : "bg-red-300 hover:bg-red-300"
            }
          >
            {difficulty}
          </Badge>
        </h1>
        <Link href="/" className="hover:underline">
          Home
        </Link>
      </div>
      <Games data={randomLesson} currentDifficulty={difficulty} />
    </>
  );
}
