import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }   // ← Changed here
) {
  try {
    const { id } = await params;           // ← Must await params
    const repairId = parseInt(id);

    const body = await request.json();

    const updatedRepair = await prisma.repairRequest.update({
      where: { id: repairId },
      data: {
        status: body.status,
        notes: body.notes ?? undefined,
      },
    });

    return NextResponse.json(updatedRepair);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Failed to update repair' },
      { status: 500 }
    );
  }
}