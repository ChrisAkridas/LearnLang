import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prismaClientSingleton = () => {
  return new PrismaClient();
};
//  if you want to integrate prisma Accelerate extension, add it at the end of the PrismaClient constructor
//? .$extends(withAccelerate())

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton> & typeof global;
};

const prismaClient = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prismaClient;

export default prismaClient;
// allow Typescript code to access a prisma property on the global object which is assumed to be a PrismaClient instance
// const globalForPrisma = global as unknown as { prisma: PrismaClient };
// export const prisma =
//   globalForPrisma.prisma || new PrismaClient({ log: ["query"] });

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
