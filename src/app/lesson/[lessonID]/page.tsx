// Types
import type { Lesson } from "@/graphql/gql_types";
// External
// Internal
import { fetchLessons, fetchLesson } from "@/lib/actions";
import Games from "./components/Games";

// The segments that are not statically generated will return a 404 error
export const dynamicParams = false;

// Generate static segments
export async function generateStaticParams() {
  const lessons = await fetchLessons();

  if (lessons) {
    return lessons.map((lesson: Pick<Lesson, "id">) => ({
      params: {
        lessonID: lesson.id,
      },
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

  const lesson = await fetchLesson(lessonID);
  if (!lesson || !lesson?.vocabulary) {
    // throw new Error("Lesson not found");
    return <div>Lesson not found</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl">{lesson?.title}</h1>
      <Games data={lesson?.vocabulary} />
    </div>
  );
}
