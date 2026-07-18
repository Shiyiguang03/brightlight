import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { normalizePhoneNumber } from '@/lib/phone';
import { prisma } from '@/lib/prisma';   // ✅ Import from central Prisma client
import { handleApiError } from '@/lib/apiError';

export async function POST(request: NextRequest) {
  try {
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return NextResponse.json({ message: 'Email/Phone and Password are required' }, { status: 400 });
    }

    let user;

    // Check if identifier looks like a phone number
    const isPhone = /^[\d\s+()-]+$/.test(identifier.trim());

    if (isPhone) {
      // Normalize phone number
      const normalizedPhone = normalizePhoneNumber(identifier);

      user = await prisma.user.findFirst({
        where: {
          phone: normalizedPhone,
        },
      });
    } else {
      // Treat as email
      user = await prisma.user.findUnique({
        where: { email: identifier.toLowerCase() },
      });
    }

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
    }

    // Return user data (without password)
    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        role: user.role,
        profileImage: 'profileImage' in user ? (user as any).profileImage : null,
      },
    });

  } catch (error) {
    return handleApiError(error, 'Login error');
  }
}