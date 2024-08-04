'use client'

import Validate from '@/lib/auth/validate'
import { getSession, useSession } from 'next-auth/react'
import React, { useEffect } from 'react'

export default function ShowcaseLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <Validate>
            <div className="flex h-full w-full flex-col">
                {children}
            </div>
        </Validate>
    )
}
