import { NextRequest, NextResponse } from "next/server";
import prismaClient from "@/../prisma/db";
import { lessons } from "@/lib/lessons";

export async function GET(request: NextRequest) {
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
    return NextResponse.json(error);
  }

  return NextResponse.json("success");
}
