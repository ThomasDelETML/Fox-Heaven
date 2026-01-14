import { motion } from 'framer-motion'
import { useGameStore } from '../store'
import { useEffect } from 'react'

export function Intro() {
    const startGame = useGameStore((state) => state.startGame)

    // Auto-start game after 5 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            startGame()
        }, 5000)

        return () => clearTimeout(timer)
    }, [startGame])

    return (
        <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
        >
            <motion.img
                src="/Fox-Heaven.png"
                alt="Fox Heaven"
                className="max-w-2xl w-full px-8 object-contain drop-shadow-2xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{
                    opacity: { duration: 1 },
                    scale: { duration: 1.2, ease: "easeOut" }
                }}
            />
        </motion.div>
    )
}
