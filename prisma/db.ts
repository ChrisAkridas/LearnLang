import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton> & typeof global;
};

const prismaClient = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prismaClient;

if (process.env.NODE_ENV !== "production")
  globalThis.prismaGlobal = prismaClient;

// allow Typescript code to access a prisma property on the global object which is assumed to be a PrismaClient instance
// const globalForPrisma = global as unknown as { prisma: PrismaClient };
// export const prisma =
//   globalForPrisma.prisma || new PrismaClient({ log: ["query"] });

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
