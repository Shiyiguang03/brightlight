import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { handleApiError } from '@/lib/apiError';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const requests = await prisma.repairRequest.findMany({
      include: {
        user: {
          select: {
            fullName: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format the data nicely for the frontend
    const formattedRequests = requests.map((req) => ({
      id: req.id,
      customerName: req.user?.fullName || 'Unknown',
      customerPhone: req.user?.phone || '',
      deviceType: req.deviceType,
      brand: req.brand,
      model: req.model,
      status: req.status,
      createdAt: req.createdAt,
    }));

    return NextResponse.json(formattedRequests);
  } catch (error) {
    return handleApiError(error, 'Error fetching repair requests');
  }
}