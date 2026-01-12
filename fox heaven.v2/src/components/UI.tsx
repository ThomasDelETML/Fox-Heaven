import { useGameStore } from '../store'

export function UI() {
    const cuddleCount = useGameStore((state) => state.cuddleCount)

    return (
        <div className="absolute top-0 left-0 p-4 pointer-events-none z-10">
            <div className="bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm text-[#d46a2e] font-bold">
                🦊 Cuggles: {cuddleCount}
            </div>
        </div>
    )
}
