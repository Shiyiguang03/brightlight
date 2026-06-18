import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ message: 'userId is required' }, { status: 400 });
    }

    const repairs = await prisma.repairRequest.findMany({
      where: {
        userId: Number(userId),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(repairs);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to fetch repairs' }, { status: 500 });
  }
}