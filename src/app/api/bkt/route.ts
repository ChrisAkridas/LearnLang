import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const pythonProcess = spawn("python", ["src/lib/scripts/python/bkt.py", JSON.stringify(body)]);

    let data = "";
    for await (const chunk of pythonProcess.stdout) {
      data += chunk;
    }

    let error = "";
    for await (const chunk of pythonProcess.stderr) {
      error += chunk;
    }

    const exitCode = await new Promise((resolve) => {
      pythonProcess.on("close", resolve);
    });

    if (exitCode !== 0) {
      throw new Error(`Python script error: ${error}`);
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// export async function GET() {
//   const pythonProcess = spawn("python", ["-c", "import sys; print(sys.version)"]);

//   let data = " ";
//   for await (const chunk of pythonProcess.stdout) {
//     data += chunk;
//   }

//   return NextResponse.json(data);
// }
