import { Context } from "@/app/api/graphql/route";

export const resolvers = {
  Query: {
    // * Query for LESSONS
    lessons: async (_parent: any, args: any, context: Context) => {
      return await context.prisma.lesson.findMany({
        include: {
          vocabulary: true,
        },
      });
    },
    lesson: async (_parent: any, args: any, context: Context) => {
      return await context.prisma.lesson.findUnique({
        where: {
          id: args.id,
        },
        include: {
          vocabulary: true,
        },
      });
    },

    // * Query for WORDS

    words: async (_parent: any, args: any, context: Context) => {
      return await context.prisma.vocabulary.findMany();
    },
    word: async (_parent: any, args: any, context: Context) => {
      return await context.prisma.vocabulary.findUnique({
        where: {
          id: args.id,
        },
      });
    },

    // * Query for USERS

    users: async (_parent: any, args: any, context: Context) => {
      return await context.prisma.user.findMany();
    },
    user: async (_parent: any, args: any, context: Context) => {
      return await context.prisma.user.findUnique({
        where: {
          id: args.id,
        },
      });
    },
  },

  Mutation: {
    deleteUser: async (_parent: any, args: any, context: Context) => {
      return await context.prisma.user.delete({
        where: {
          id: args.id,
        },
      });
    },
  },
};
