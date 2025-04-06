import type { BKTRouteBody } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";
import { writeCSVFile } from "@/app/api/functions/helper";

export async function POST(req: NextRequest) {
  try {
    const body: BKTRouteBody = await req.json();

    await writeCSVFile(body.data, body.filename || "trainingDataset.csv", true);

    return NextResponse.json({ message: `${body.filename || "trainingDataset.csv"} updated successfully` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
