import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Business timezone: Malaysia, UTC+8, no DST. Computed explicitly rather than
// via server-local Date methods, since the deploy host (e.g. Vercel) runs UTC —
// relying on local time would shift the date part and the day-boundary count
// window by up to 8 hours from the actual Malaysia business day.
const MALAYSIA_OFFSET_MS = 8 * 60 * 60 * 1000;

export async function generateWorkOrderNumber(prefix: 'WEB' | 'A-BL'): Promise<string> {
    const nowUtcMs = Date.now();
    const local = new Date(nowUtcMs + MALAYSIA_OFFSET_MS);

    // Format date: DDMMYY (read via UTC getters on the shifted instant so this
    // doesn't depend on the server process's own timezone setting)
    const day = String(local.getUTCDate()).padStart(2, '0');
    const month = String(local.getUTCMonth() + 1).padStart(2, '0');
    const year = String(local.getUTCFullYear()).slice(-2);
    const datePart = `${day}${month}${year}`;

    // Malaysia midnight, expressed as real UTC instants
    const startOfDayLocalMs = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate());
    const startOfDay = new Date(startOfDayLocalMs - MALAYSIA_OFFSET_MS);
    const endOfDay = new Date(startOfDayLocalMs + 24 * 60 * 60 * 1000 - MALAYSIA_OFFSET_MS);

    // Count ALL repair requests created TODAY (both WEB and A-BL)
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