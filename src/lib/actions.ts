"use server";

// Types
import { type Lesson } from "@/graphql/gql_types";
// External
// Internal
import fetchGraphQL from "./fetchGQL";
import { GET_LESSONS, GET_LESSON } from "@/graphql/queries";

export async function fetchLessons() {
  const { lessons } = await fetchGraphQL(GET_LESSONS);
  return lessons as Lesson[];
}

export async function fetchLesson(id: string) {
  const { lesson } = await fetchGraphQL(GET_LESSON, { id });
  return lesson as Partial<Lesson>;
}
