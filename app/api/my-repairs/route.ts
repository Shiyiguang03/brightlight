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

    // Explicitly select all fields including images
    const repairs = await prisma.repairRequest.findMany({
      where: {
        userId: Number(userId),
      },
      select: {
        id: true,
        deviceType: true,
        brand: true,
        model: true,
        serialNumber: true,
        problemDescription: true,
        password: true,
        hasCharger: true,
        hasPowerCord: true,
        hasMouse: true,
        hasBag: true,
        otherItems: true,
        preferredStartDate: true,
        preferredEndDate: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        images: true,                    // ← Force include images
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Debug log - check your terminal
    console.log('=== My Repairs API Response ===');
    console.log('User ID:', userId);
    console.log('Number of repairs:', repairs.length);
    if (repairs.length > 0) {
      console.log('First repair images:', repairs[0].images);
    }

    return NextResponse.json(repairs);

  } catch (error) {
    console.error('Error fetching repairs:', error);
    return NextResponse.json({ message: 'Failed to fetch repairs' }, { status: 500 });
  }
}