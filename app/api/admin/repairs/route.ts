import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Filters
    const status = searchParams.get('status');
    const search = searchParams.get('search') || '';

    // Build where condition (database level filtering)
    const where: any = {};

    if (status && status !== 'All') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { brand: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
        { deviceType: { contains: search, mode: 'insensitive' } },
        {
          user: {
            fullName: { contains: search, mode: 'insensitive' }
          }
        }
      ];
    }

    // Get total count + data in parallel (efficient)
    const [total, repairs] = await Promise.all([
      prisma.repairRequest.count({ where }),
      prisma.repairRequest.findMany({
        where,
        include: {
          user: {
            select: { fullName: true, phone: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      })
    ]);

    return NextResponse.json({
      data: repairs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    console.error('Error fetching repairs:', error);
    return NextResponse.json(
      { message: 'Failed to fetch repair requests' },
      { status: 500 }
    );
  }
}