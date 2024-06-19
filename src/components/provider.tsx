"use client";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

const Provider: FCC = ({ children }) => {
  const client = new ApolloClient({
    uri: "/api/graphql",
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default Provider;
