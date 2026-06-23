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
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(repairs);
  } catch (error) {
    console.error('Error fetching repairs:', error);
    return NextResponse.json(
      { message: 'Failed to fetch repair requests' },
      { status: 500 }
    );
  }
}