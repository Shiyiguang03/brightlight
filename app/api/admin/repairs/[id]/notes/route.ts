import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/apiError';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }   // ✅ Fixed: params is now a Promise
) {
  const { id } = await params;                       // ✅ Must await params
  const repairId = parseInt(id);

  if (isNaN(repairId)) {
    return NextResponse.json({ error: 'Invalid repair ID' }, { status: 400 });
  }

  try {
    const notes = await prisma.repairNote.findMany({
      where: { repairId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(notes);
  } catch (error) {
    return handleApiError(error, 'Error fetching notes');
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }   // ✅ Fixed: params is now a Promise
) {
  const { id } = await params;                       // ✅ Must await params
  const repairId = parseInt(id);

  if (isNaN(repairId)) {
    return NextResponse.json({ error: 'Invalid repair ID' }, { status: 400 });
  }

  const body = await request.json();
  const { content } = body;

  if (!content || content.trim() === '') {
    return NextResponse.json({ error: 'Note content is required' }, { status: 400 });
  }

  try {
    const newNote = await prisma.repairNote.create({
      data: {
        repairId,
        content: content.trim(),
        createdBy: 'Staff',
      },
    });

    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'Error creating note');
  }
}