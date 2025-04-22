import type { BKTData } from "@/types/types";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import os from "os";

export async function writeCSVFile(data: BKTData[], filename: string = "data.csv", append: boolean = false) {
  "use server";

  try {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((row) => Object.values(row).join(","));
    const csvContent = [headers, ...rows].join("\n");
    const postfixPathName = os.platform() === "linux" ? "/src/lib/scripts/python" : "\\src\\lib\\scripts\\python";

    // Define file path
    const uploadsDir = path.join(process.cwd(), postfixPathName);

    // Create directory if it doesn't exist
    // if (!fs.existsSync(uploadsDir)) {
    //   fs.mkdirSync(uploadsDir, { recursive: true });
    // }

    const filePath = path.join(uploadsDir, filename);

    // Write CSV content to file
    if (append) {
      await fs.appendFile(filePath, "\n" + rows.join("\n"));
    } else {
      await fs.writeFile(filePath, csvContent);
    }
    return NextResponse.json({
      success: true,
      message: "CSV file created successfully",
      filePath: postfixPathName,
    });
  } catch (error: any) {
    console.error("Error creating CSV file:", error);
    return NextResponse.json(
      {
        error: "Failed to create CSV file",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
