"use server";

import fetchGraphQL from "./graphql";
import { GET_NOVELS } from "@/graphql/queries";

export async function getLessons() {
  const data = await fetchGraphQL(GET_NOVELS);

  return data;
}
