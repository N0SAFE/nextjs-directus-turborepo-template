import { NextResponse } from 'next/server'
import { orpc } from '@/lib/orpc'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        // Call the ORPC user endpoint
        const result = await orpc.user.list({
            query: {
                limit: 10,
                offset: 0,
                sortBy: 'createdAt',
                sortOrder: 'desc',
            }
        });

        return NextResponse.json(result)
    } catch (error: unknown) {
        console.error('Error fetching users:', error)
        return NextResponse.json(
            {
                error: 'An unexpected error occurred while fetching users',
                message: (error as Error).message,
            },
            { status: 500 }
        )
    }
}
