import type { BKTData, BKTRouteBody } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";
import { writeCSVFile } from "@/app/api/functions/helper";

export async function POST(req: NextRequest) {
  try {
    const body: BKTRouteBody = await req.json();
    const ip = req.headers.get("x-forwarded-for")?.split(":")[0]?.trim() || "localhost";
    const fileName = body.filename || "trainingDataset";
    const userAnswers = body.data.map(
      (it) =>
        ({
          ...it,
          user_id: ip,
        } as BKTData)
    );
    await writeCSVFile(userAnswers, fileName, true);

    return NextResponse.json({ message: `${fileName} updated successfully` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
