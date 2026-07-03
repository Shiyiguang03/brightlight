import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function generateWorkOrderNumber(prefix: 'WEB' | 'A-BL'): Promise<string> {
    const today = new Date();

    // Format date: DDMMYY
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = String(today.getFullYear()).slice(-2);
    const datePart = `${day}${month}${year}`;

    // Count ALL repair requests created TODAY (both WEB and A-BL)
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const count = await prisma.repairRequest.count({
        where: {
            createdAt: {
                gte: startOfDay,
                lt: endOfDay,
            },
        },
    });

    const nextNumber = String(count + 1).padStart(3, '0');

    return `WO-${prefix}-${datePart}-${nextNumber}`;
}