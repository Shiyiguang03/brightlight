import { prisma } from './prisma';

export async function generateWorkOrderNumber(source: 'WEB' | 'A-BL'): Promise<string> {
  const today = new Date();
  
  // Format: DDMMYY
  const datePart = today.toLocaleDateString('en-GB').replace(/\//g, '');

  // Get start and end of today
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  // Count how many repairs were created today (shared between customer & agent)
  const countToday = await prisma.repairRequest.count({
    where: {
      createdAt: {
        gte: startOfDay,
        lt: endOfDay,
      },
    },
  });

  // Next number (001, 002, 003...)
  const nextNumber = (countToday + 1).toString().padStart(3, '0');

  return `WO-${source}-${datePart}-${nextNumber}`;
}