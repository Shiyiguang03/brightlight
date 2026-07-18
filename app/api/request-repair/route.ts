import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { generateWorkOrderNumber } from '@/lib/generateWorkOrderNumber';   // ← ADD THIS
import { handleApiError } from '@/lib/apiError';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Initialize Supabase inside the function (safer for build)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const userId = Number(formData.get('userId'));
    const deviceType = formData.get('deviceType') as string;
    const brand = formData.get('brand') as string;
    const model = formData.get('model') as string;
    const serialNumber = formData.get('serialNumber') as string || null;
    const problemDescription = formData.get('problemDescription') as string;
    const password = formData.get('password') as string || null;
    const hasCharger = formData.get('hasCharger') === 'true';
    const hasPowerCord = formData.get('hasPowerCord') === 'true';
    const hasMouse = formData.get('hasMouse') === 'true';
    const hasBag = formData.get('hasBag') === 'true';
    const hasOther = formData.get('hasOther') === 'true';
    const otherItems = formData.get('otherItems') as string || null;
    const preferredStartDate = formData.get('preferredStartDate') as string || null;
    const preferredEndDate = formData.get('preferredEndDate') as string || null;

    const imageFiles = formData.getAll('deviceImages') as File[];

    if (!userId || !deviceType || !brand || !model || !problemDescription) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Upload images
    const imageUrls: string[] = [];

    for (const file of imageFiles) {
      const fileName = `${Date.now()}-${file.name}`;

      const { data, error } = await supabase.storage
        .from('repair-images')
        .upload(fileName, file);

      if (error) {
        console.error('Image upload error:', error);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from('repair-images')
        .getPublicUrl(fileName);

      if (urlData?.publicUrl) {
        imageUrls.push(urlData.publicUrl);
      }
    }

    // ==================== GENERATE WORK ORDER NUMBER ====================
    const workOrderNumber = await generateWorkOrderNumber('WEB');   // ← ADD THIS

    // Save to database
    const repairRequest = await prisma.repairRequest.create({
      data: {
        userId,
        deviceType,
        brand,
        model,
        serialNumber,
        problemDescription,
        password,
        hasCharger,
        hasPowerCord,
        hasMouse,
        hasBag,
        otherItems: hasOther ? otherItems : null,
        preferredStartDate: preferredStartDate ? new Date(preferredStartDate) : null,
        preferredEndDate: preferredEndDate ? new Date(preferredEndDate) : null,
        images: imageUrls,
        workOrderNumber,                    // ← ADD THIS
      },
    });

    return NextResponse.json({
      message: 'Repair request submitted successfully',
      repairRequest,
    }, { status: 201 });

  } catch (error) {
    return handleApiError(error, 'Error creating repair request');
  }
}