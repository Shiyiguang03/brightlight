import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      userId,                    // Customer ID (we'll handle this later)
      submittedByAgentId,        // Agent's ID
      customerName,
      customerPhone,
      customerAddress,
      deviceType,
      brand,
      model,
      serialNumber,
      problemDescription,
      urgency,
      preferredDate,
      preferredTime,
      internalNotes,
      images,                    // array of image URLs
    } = body;

    // For now, we'll create the request without linking to a real customer user
    // (You can improve this later by creating a guest customer or linking properly)

    const repairRequest = await prisma.repairRequest.create({
      data: {
        // Temporary: We'll use a placeholder userId for now
        // In real flow, you should either create a user or have customer select existing
        userId: userId || 1, // ← Change this later when you have proper customer linking

        submittedByAgentId: submittedByAgentId || null,
        deviceType,
        brand,
        model,
        serialNumber: serialNumber || null,
        problemDescription,
        urgency: urgency || 'Normal',
        preferredStartDate: preferredDate ? new Date(preferredDate) : null,
        internalNotes: internalNotes || null,
        images: images || [],
        status: 'Pending',
      },
    });

    return NextResponse.json({
      message: 'Repair request submitted successfully',
      requestId: repairRequest.id,
    });
  } catch (error: any) {
    console.error('Error submitting repair request:', error);
    return NextResponse.json(
      { message: 'Failed to submit repair request', error: error.message },
      { status: 500 }
    );
  }
}