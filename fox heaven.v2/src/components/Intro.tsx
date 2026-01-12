import { motion } from 'framer-motion'
import { useGameStore } from '../store'

export function Intro() {
    const startGame = useGameStore((state) => state.startGame)

    return (
        <motion.div
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#fdf6e3] text-[#5c4033]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
        >
            <motion.img
                src="/logo.png"
                alt="Fox Heaven"
                className="w-64 h-64 mb-8 object-contain"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
            />

            <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="text-4xl font-serif mb-8 tracking-wider"
            >
                Fox Heaven
            </motion.h1>

            <motion.button
                onClick={startGame}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 border-2 border-[#d46a2e] text-[#d46a2e] rounded-full text-xl hover:bg-[#d46a2e] hover:text-white transition-colors duration-300"
            >
                Enter Garden
            </motion.button>
        </motion.div>
    )
}
