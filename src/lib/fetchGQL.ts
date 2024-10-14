export default async function fetchGraphQL(
  query: string,
  variables: { [key: string]: any } = {}
) {
  const res = await fetch("http://localhost:3000/api/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  const result = await res.json();

  return result.data;
}
