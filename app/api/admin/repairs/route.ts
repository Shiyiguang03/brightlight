import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const repairs = await prisma.repairRequest.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    return NextResponse.json(repairs);
  } catch (error: any) {
    console.error("Error in GET /api/admin/repairs:", error);
    return NextResponse.json(
      { message: "Failed to fetch repairs", error: error.message },
      { status: 500 }
    );
  }
}