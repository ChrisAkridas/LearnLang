// Types
import type { Lesson } from "@/graphql/gql_types";
// Exteranl
// Internal
import fetchGraphQL from "@/lib/fetchGQL";
import { GET_LESSONS } from "@/graphql/queries";

// The segments that are not statically generated will return a 404 error
export const dynamicParams = false;

// Generate static segments
export async function generateStaticParams() {
  const { lessons } = await fetchGraphQL(GET_LESSONS);

  return lessons.map((lesson: Pick<Lesson, "id">) => ({
    params: {
      lessonID: lesson.id,
    },
  }));
}

interface LessonProps {
  params: {
    lessonID: string;
  };
}

export default function Lesson({ params }: LessonProps) {
  const { lessonID } = params;
  return (
    <div>
      <h1>Lesson: {lessonID}</h1>

      <section className="mt-10">Main Section</section>
    </div>
  );
}
