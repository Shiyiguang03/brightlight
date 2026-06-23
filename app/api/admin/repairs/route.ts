import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log("=== Starting /api/admin/repairs ===");

    const repairs = await prisma.repairRequest.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    console.log("=== Successfully fetched repairs ===", repairs.length);
    return NextResponse.json(repairs);

  } catch (error: any) {
    console.error("=== ERROR IN /api/admin/repairs ===");
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Full error:", error);

    return NextResponse.json(
      { 
        message: "Failed to fetch repairs", 
        error: error.message || "Unknown error",
        code: error.code || null
      }, 
      { status: 500 }
    );
  }
}