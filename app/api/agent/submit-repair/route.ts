import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateWorkOrderNumber } from '@/lib/generateWorkOrderNumber';
import { handleApiError } from '@/lib/apiError';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Generate Work Order Number for Agent-created requests
    const workOrderNumber = await generateWorkOrderNumber('A-BL');

    // Create the repair request
    const repairRequest = await prisma.repairRequest.create({
      data: {
        // Work Order Number (NEW)
        workOrderNumber,

        // Customer Information (from agent form)
        customerName: body.customerName || null,
        customerPhone: body.customerPhone || null,
        customerAddress: body.customerAddress || null,

        // Device Information
        deviceType: body.deviceType,
        brand: body.brand,
        model: body.model,
        serialNumber: body.serialNumber || null,

        // Problem
        problemDescription: body.problemDescription,

        // Optional fields
        urgency: body.urgency || 'Normal',
        preferredStartDate: body.preferredDate ? new Date(body.preferredDate) : null,
        preferredEndDate: body.preferredTime ? new Date(body.preferredTime) : null, // You can adjust this logic later
        internalNotes: body.internalNotes || null,

        // Images
        images: body.images || [],

        // Agent who submitted
        user: {
          connect: {
            id: body.submittedByAgentId,
          },
        },

        // Default status
        status: 'Pending',
      },
    });

    return NextResponse.json({
      message: 'Repair request submitted successfully',
      requestId: repairRequest.id,
      workOrderNumber: repairRequest.workOrderNumber,
    }, { status: 201 });

  } catch (error) {
    return handleApiError(error, 'Error creating agent repair request');
  }
}