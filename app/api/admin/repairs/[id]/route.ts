import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();

    const updatedRepair = await prisma.repairRequest.update({
      where: { id },
      data: {
        status: body.status,
        notes: body.notes || undefined,
      },
    });

    return NextResponse.json(updatedRepair);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to update repair' }, { status: 500 });
  }
}