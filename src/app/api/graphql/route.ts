// Types
import type { PrismaClient } from "@prisma/client";
// External

// Internal
import prismaClient from "@/../prisma/db";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { NextRequest } from "next/server";
import { typeDefs } from "@/graphql/schema";
import { resolvers } from "@/graphql/resolvers";

export type Context = {
  prisma: PrismaClient;
};

const GQL_Server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(GQL_Server, {
  context: async (req, res) => ({ req, res, prisma: prismaClient }),
});

export { handler as GET, handler as POST };
