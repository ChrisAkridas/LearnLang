import { PrismaClient } from "@prisma/client";

// allow Typescript code to access a prisma property on the global object which is assumed to be a PrismaClient instance
const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma =
  globalForPrisma.prisma || new PrismaClient({ log: ["query"] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
