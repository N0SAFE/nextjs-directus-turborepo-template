import { Session } from 'next-auth'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware' // add to the useSession store

interface SessionState {
    session: Session | null
    setSession: (session: Session | null) => void
}

export const useSession = create<SessionState>()((set) => ({
    session: null,
    setSession: (session: Session | null) => set({ session }),
}))
