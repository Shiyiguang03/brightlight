import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, phone, email, password, role } = body;

    // Basic validation
    if (!fullName || !phone || !password || !role) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if phone already exists
    const existingUser = await prisma.user.findUnique({
      where: { phone: phone },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Phone number already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        fullName,
        phone,
        email: email || null,
        password: hashedPassword,
        role,
      },
    });

    return NextResponse.json(
      { 
        message: 'Account created successfully',
        user: {
          id: user.id,
          fullName: user.fullName,
          role: user.role,
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}