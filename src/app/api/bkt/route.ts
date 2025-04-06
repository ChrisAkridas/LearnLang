import type { BKTData, BKTRouteBody } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";
import { writeCSVFile } from "@/app/api/functions/helper";
import { spawn } from "child_process";

export async function POST(req: NextRequest) {
  try {
    const body: BKTRouteBody = await req.json();

    writeCSVFile(body.data, body.filename);
    // const pythonProcess = spawn("python", ["src/lib/scripts/python/bkt.py", JSON.stringify(body)]);

    // let data = "";
    // for await (const chunk of pythonProcess.stdout) {
    //   data += chunk;
    // }

    // let error = "";
    // for await (const chunk of pythonProcess.stderr) {
    //   error += chunk;
    // }

    // const exitCode = await new Promise((resolve) => {
    //   pythonProcess.on("close", resolve);
    // });

    // if (exitCode !== 0) {
    //   throw new Error(`Python script error: ${error}`);
    // }

    // return NextResponse.json(data);
    return NextResponse.json({ message: "CSV file created successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
