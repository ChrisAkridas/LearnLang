import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // console.log(request);

  try {
    const response =
      await sql`CREATE TABLE Pets (Name varchar(255), Owner varchar(255))`;
    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
