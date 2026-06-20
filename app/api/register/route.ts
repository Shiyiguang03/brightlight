import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { normalizePhoneNumber } from '@/lib/phone';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { fullName, phone, email, password, role } = await request.json();

    if (!fullName || !phone || !password) {
      return NextResponse.json({ message: 'Full name, phone, and password are required' }, { status: 400 });
    }

    // Normalize phone number
    const normalizedPhone = normalizePhoneNumber(phone);

    // Check if phone already exists
    const existingPhone = await prisma.user.findUnique({
      where: { phone: normalizedPhone },
    });

    if (existingPhone) {
      return NextResponse.json({ message: 'Phone number already registered' }, { status: 400 });
    }

    // Check if email already exists (if provided)
    if (email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (existingEmail) {
        return NextResponse.json({ message: 'Email already registered' }, { status: 400 });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with normalized phone
    const newUser = await prisma.user.create({
      data: {
        fullName,
        phone: normalizedPhone,
        email: email ? email.toLowerCase() : null,
        password: hashedPassword,
        role: role || 'CUSTOMER',
      },
    });

    return NextResponse.json({
      message: 'Account created successfully',
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        phone: newUser.phone,
        email: newUser.email,
        role: newUser.role,
      },
    }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}