import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
    console.error('Error fetching notes:', error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
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
    console.error('Error creating note:', error);
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}