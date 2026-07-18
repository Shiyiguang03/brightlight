import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { handleApiError } from '@/lib/apiError';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { fullName, phone, email, password, role } = await request.json();

    // ✅ Security: Only allow CUSTOMER role during public registration
    if (role !== 'CUSTOMER') {
      return NextResponse.json(
        { message: 'Invalid role. Only CUSTOMER role is allowed during registration.' },
        { status: 400 }
      );
    }

    // Validation
    if (!fullName || !phone || !password) {
      return NextResponse.json(
        { message: 'Full name, phone, and password are required' },
        { status: 400 }
      );
    }

    // Check if phone already exists
    const existingPhone = await prisma.user.findUnique({
      where: { phone: phone },
    });

    if (existingPhone) {
      return NextResponse.json(
        { message: 'Phone number already registered' },
        { status: 400 }
      );
    }

    // Check if email already exists (if provided)
    if (email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email: email },
      });

      if (existingEmail) {
        return NextResponse.json(
          { message: 'Email already registered' },
          { status: 400 }
        );
      }
    }

    // Create new user (force role to CUSTOMER)
    const newUser = await prisma.user.create({
      data: {
        fullName,
        phone,
        email: email || null,
        password,           // Currently storing plain text (you can add bcrypt later)
        role: 'CUSTOMER',   // ← Force CUSTOMER role
      },
    });

    return NextResponse.json(
      {
        message: 'Account created successfully',
        user: {
          id: newUser.id,
          fullName: newUser.fullName,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error, 'Registration error');
  }
}