"use client";

import { useQuery, gql, useMutation } from "@apollo/client";
import { ADD_NOVEL } from "@/graphql/mutations";
import { Novels } from "@/components/Novels";

export default function Home() {
  const [mutateFunction, { data, loading, error }] = useMutation(ADD_NOVEL);
  if (error) console.log(error);
  return (
    <div className=" max-w-5xl mx-auto ">
      {" "}
      {/* <Novels />{" "} */}
      <button
        onClick={() => {
          mutateFunction({ variables: { title: "test", image: "test" } });
        }}
      >
        Click to Create Novel
      </button>
    </div>
  );
}
