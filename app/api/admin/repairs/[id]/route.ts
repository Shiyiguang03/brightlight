import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const repairId = parseInt(id);

    const body = await request.json();

    const updatedRepair = await prisma.repairRequest.update({
      where: { id: repairId },
      data: {
        status: body.status,
        // notes removed temporarily because the field doesn't exist in schema
      },
    });

    return NextResponse.json(updatedRepair);
  } catch (error: any) {
    console.error("Error updating repair:", error);
    return NextResponse.json(
      { message: "Failed to update repair", error: error.message },
      { status: 500 }
    );
  }
}