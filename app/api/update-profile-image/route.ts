import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { handleApiError } from '@/lib/apiError';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId, imageUrl } = await request.json();

    if (!userId || !imageUrl) {
      return NextResponse.json({ message: 'Missing userId or imageUrl' }, { status: 400 });
    }

    // Use a raw SQL update to avoid TypeScript errors if the Prisma model
    // doesn't include the profileImage field. Then fetch the user and
    // return the updated image URL in the response.
    await prisma.$executeRawUnsafe(
      'UPDATE "User" SET "profileImage" = $1 WHERE id = $2',
      imageUrl,
      Number(userId)
    );

    const updatedUser = await prisma.user.findUnique({ where: { id: Number(userId) } });

    return NextResponse.json({
      message: 'Profile image updated successfully',
      user: {
        id: updatedUser?.id,
        fullName: updatedUser?.fullName,
        email: updatedUser?.email,
        phone: updatedUser?.phone,
        role: updatedUser?.role,
        profileImage: imageUrl,
      },
    });
  } catch (error) {
    return handleApiError(error, 'Error updating profile image');
  }
}