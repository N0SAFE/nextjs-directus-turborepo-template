"use server";

import { signOut } from '@/lib/auth/index';

export async function logout(...params: Parameters<typeof signOut>) {
    return signOut(...params)
}
