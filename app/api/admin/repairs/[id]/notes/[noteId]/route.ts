import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/apiError';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; noteId: string }> }  // ✅ Fixed
) {
  const { noteId } = await params;                    // ✅ Must await
  const noteIdNum = parseInt(noteId);

  if (isNaN(noteIdNum)) {
    return NextResponse.json({ error: 'Invalid note ID' }, { status: 400 });
  }

  try {
    await prisma.repairNote.delete({
      where: { id: noteIdNum },
    });

    return NextResponse.json({ message: 'Note deleted successfully' });
  } catch (error) {
    return handleApiError(error, 'Error deleting note');
  }
}