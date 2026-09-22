import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json(
      {
        success: true,
        status: "ok",
        checks: {
          database: "ok",
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("readiness_failed", { type: error instanceof Error ? error.name : "unknown" });

    return NextResponse.json(
      {
        success: false,
        status: "degraded",
        checks: {
          database: "unavailable",
        },
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
