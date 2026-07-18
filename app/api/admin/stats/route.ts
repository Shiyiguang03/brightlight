import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { handleApiError } from '@/lib/apiError';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const totalCustomers = await prisma.user.count({
      where: { role: 'CUSTOMER' },
    });

    const totalStaff = await prisma.user.count({
      where: { role: 'STAFF' },
    });

    const totalAgents = await prisma.user.count({
      where: { role: 'AGENT' },
    });

    const totalRepairs = await prisma.repairRequest.count();

    return NextResponse.json({
      totalCustomers,
      totalStaff,
      totalAgents,
      totalRepairs,
    });
  } catch (error) {
    return handleApiError(error, 'Error fetching stats');
  }
}