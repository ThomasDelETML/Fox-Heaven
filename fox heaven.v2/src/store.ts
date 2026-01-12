import { create } from 'zustand'

type GameState = 'INTRO' | 'PLAYING'

interface GameStore {
    gameState: GameState
    startGame: () => void
    cuddleCount: number
    incrementCuddle: () => void
}

export const useGameStore = create<GameStore>((set) => ({
    gameState: 'INTRO',
    startGame: () => set({ gameState: 'PLAYING' }),
    cuddleCount: 0,
    incrementCuddle: () => set((state) => ({ cuddleCount: state.cuddleCount + 1 })),
}))
