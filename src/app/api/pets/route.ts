import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const petName = searchParams.get("petName");
  const ownerName = searchParams.get("ownerName");
  try {
    if (!petName || !ownerName) throw new Error("Missing petName or ownerName");
    await sql`INSERT INTO Pets (name, owner) VALUES (${petName}, ${ownerName})`;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  const pets = await sql`SELECT * FROM Pets`;
  return NextResponse.json({ pets }, { status: 200 });
}