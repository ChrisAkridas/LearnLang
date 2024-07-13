import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/../prisma/db";
import { lessons } from "@/lib/lessons";

export async function GET(request: NextRequest) {
  try {
    for (const lesson of lessons) {
      await prisma.lesson.create({
        data: {
          title: lesson.title,
          vocabulary: {
            createMany: {
              data: lesson.vocabulary,
            },
          },
        },
      });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }

  // const lesson = await prisma.lesson.deleteMany({});
  // console.log(lesson);
  return NextResponse.json("success");
}
