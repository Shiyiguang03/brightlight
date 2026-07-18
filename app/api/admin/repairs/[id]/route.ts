import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/apiError';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const repairId = parseInt(id);

    if (isNaN(repairId)) {
      return NextResponse.json(
        { message: 'Invalid request ID' },
        { status: 400 }
      );
    }

    const repairRequest = await prisma.repairRequest.findUnique({
      where: { id: repairId },
      include: {
        user: {
          select: {
            fullName: true,
            phone: true,
            email: true,
            address: true,        // ✅ Now included
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
  } catch (error) {
    return handleApiError(error, 'Error fetching repair request');
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const repairId = parseInt(id);
    const body = await request.json();

    const updated = await prisma.repairRequest.update({
      where: { id: repairId },
      data: {
        status: body.status,
        internalNotes: body.notes,
        hasCharger: body.hasCharger,
        hasPowerCord: body.hasPowerCord,
        hasMouse: body.hasMouse,
        hasBag: body.hasBag,
        otherItems: body.otherItems,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error, 'Error updating repair request');
  }
}