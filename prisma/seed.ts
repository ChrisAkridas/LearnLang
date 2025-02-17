import prismaClient from "@/../prisma/db";
import { lessons } from "@/lib/lessons";

await prismaClient.lesson.deleteMany({});
try {
  for (const lesson of lessons) {
    await prismaClient.lesson.create({
      data: {
        title: lesson.title,
        vocabulary: {
          createMany: {
            data: lesson.vocabulary,
          },
        },
        fillBlanks: {
          createMany: {
            data: lesson.fillBlanks,
          },
        },
      },
    });
  }
} catch (error) {
  console.log(error);
}
