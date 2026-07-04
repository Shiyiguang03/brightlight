import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client/edge';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const agentIdParam = searchParams.get('agentId');

        if (!agentIdParam) {
            return NextResponse.json({ message: 'agentId is required' }, { status: 400 });
        }

        const agentId = Number(agentIdParam);

        const requests = await prisma.repairRequest.findMany({
            where: {
                submittedByAgentId: agentId,
            },
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                id: true,
                workOrderNumber: true,
                customerName: true,
                deviceType: true,
                brand: true,
                model: true,
                status: true,
                urgency: true,
                createdAt: true,
                user: {
                    select: { fullName: true, phone: true },
                },
            },
        });

        return NextResponse.json(requests);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}