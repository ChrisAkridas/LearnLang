"use server";

import { type Lesson } from "@/graphql/gql_types";
import fetchGraphQL from "./fetchGQL";
import { GET_LESSONS } from "@/graphql/queries";

export async function fetchLessons() {
  try {
    const { lessons } = await fetchGraphQL(GET_LESSONS);
    return lessons as Lesson[];
  } catch (error) {
    console.error("Failed to fetch lessons", error);
    return [];
  }
}
