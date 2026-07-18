import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/apiError';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const repairId = parseInt(id);
    const body = await request.json();

    const condition = await prisma.repairCondition.create({
      data: {
        repairRequestId: repairId,
        hasDent: body.hasDent,
        hasScratch: body.hasScratch,
        hasSticker: body.hasSticker,
        hasStain: body.hasStain,
        otherConditions: body.otherConditions,
        returnedAccessories: body.returnedAccessories,
        notes: body.notes || null,
      },
    });

    return NextResponse.json(condition);
  } catch (error) {
    return handleApiError(error, 'Error saving condition');
  }
}