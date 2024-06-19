import { ApolloServer } from "@apollo/server";
import { prisma } from "@/../prisma/db";
import { startServerAndCreateNextHandler } from "@as-integrations/next";

import { PrismaClient } from "@prisma/client";
import { resolvers } from "@/graphql/resolvers";
import { typeDefs } from "@/graphql/schema";

export type Context = {
  prisma: PrismaClient;
};

// create an ApolloServer instance
const apolloServer = new ApolloServer<Context>({
  typeDefs,
  resolvers,
});

// the request from Next.js is passed to the ApolloServer instance
export default startServerAndCreateNextHandler(apolloServer, {
  context: async (req, res) => ({ req, res, prisma }),
});
