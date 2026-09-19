import { NextResponse } from "next/server";
import { generateAntiSpamToken } from "@/lib/anti-spam";

export const dynamic = "force-dynamic";

export async function GET() {
  const token = generateAntiSpamToken();
  return NextResponse.json({ token });
}
