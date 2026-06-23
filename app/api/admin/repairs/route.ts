import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const repairs = await prisma.repairRequest.findMany({
      include: {
        user: {
          select: {
            fullName: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(repairs);
  } catch (error) {
    console.error('Error in /api/admin/repairs:', error);
    return NextResponse.json(
      { message: 'Failed to fetch repairs', error: String(error) },
      { status: 500 }
    );
  }
}