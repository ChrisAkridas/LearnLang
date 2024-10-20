// Types
import type { Lesson } from "@/graphql/gql_types";
// External
// Internal
import { fetchLessons, fetchLesson } from "@/lib/actions";

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
  }

  return [];
}

interface LessonProps {
  params: {
    lessonID: string;
  };
}

export default async function Lesson({ params }: LessonProps) {
  const { lessonID } = params;

  const lesson = await fetchLesson(lessonID);

  return (
    <div>
      <h1>Lesson: {lessonID}</h1>

      <section className="mt-10">
        <div>{lesson?.title}</div>
        <div>Lesson No.{lesson?.lessonNumber}</div>

        <section>
          {lesson?.vocabulary?.map((word) => (
            <div key={lesson.id} className="flex gap-8">
              <div>{word.english}</div>
              <div>{word.greek}</div>
              <div>{word.greeklist}</div>
            </div>
          ))}
        </section>
      </section>
    </div>
  );
}
