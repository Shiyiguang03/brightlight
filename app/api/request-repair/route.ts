import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      userId,
      deviceType,
      brand,
      model,
      serialNumber,
      problemDescription,
      password,
      hasCharger,
      hasPowerCord,
      hasMouse,
      hasBag,
      otherItems,
      preferredStartDate,
      preferredEndDate,
    } = body;

    if (!userId || !deviceType || !brand || !model || !problemDescription) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const repairRequest = await prisma.repairRequest.create({
      data: {
        userId: Number(userId),
        deviceType,
        brand,
        model,
        serialNumber: serialNumber || null,
        problemDescription,
        password: password || null,
        hasCharger: Boolean(hasCharger),
        hasPowerCord: Boolean(hasPowerCord),
        hasMouse: Boolean(hasMouse),
        hasBag: Boolean(hasBag),
        otherItems: otherItems || null,
        preferredStartDate: preferredStartDate ? new Date(preferredStartDate) : null,
        preferredEndDate: preferredEndDate ? new Date(preferredEndDate) : null,
      },
    });

    return NextResponse.json(
      {
        message: 'Repair request submitted successfully',
        repairRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating repair request:', error);
    return NextResponse.json(
      { message: 'Something went wrong while saving the request' },
      { status: 500 }
    );
  }
}