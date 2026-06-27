import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const requestId = parseInt(id);

    const repairRequest = await prisma.repairRequest.findUnique({
      where: { id: requestId },
      include: {
        user: {
          select: {
            fullName: true,
            phone: true,
          },
        },
      },
    });

    if (!repairRequest) {
      return NextResponse.json(
        { message: 'Repair request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(repairRequest);
  } catch (error: any) {
    console.error('Error fetching repair request:', error);
    return NextResponse.json(
      { message: 'Failed to fetch repair request' },
      { status: 500 }
    );
  }
}