import { create } from 'zustand'

type GameState = 'INTRO' | 'PLAYING'

interface GameStore {
    gameState: GameState
    startGame: () => void
    cuddleCount: number
    incrementCuddle: () => void
    // Track fox positions for social interactions
    foxes: Record<string, [number, number, number]>
    updateFox: (id: string, position: [number, number, number]) => void
    removeFox: (id: string) => void
    heldFoxId: string | null
    setHeldFox: (id: string | null) => void
}

export const useGameStore = create<GameStore>((set) => ({
    gameState: 'INTRO',
    startGame: () => set({ gameState: 'PLAYING' }),
    cuddleCount: 0,
    incrementCuddle: () => set((state) => ({ cuddleCount: state.cuddleCount + 1 })),
    foxes: {},
    updateFox: (id, position) => set((state) => ({
        foxes: { ...state.foxes, [id]: position }
    })),
    removeFox: (id) => set((state) => {
        const { [id]: _, ...remainingFoxes } = state.foxes
        return { foxes: remainingFoxes }
    }),
    heldFoxId: null,
    setHeldFox: (id) => set({ heldFoxId: id }),
}))
