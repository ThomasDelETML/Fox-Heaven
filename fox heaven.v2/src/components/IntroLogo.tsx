import { useEffect, useRef, useState } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'
import * as THREE from 'three'
import { useGameStore } from '../store'

export function IntroLogo() {
    const meshRef = useRef<THREE.Mesh>(null)
    const materialRef = useRef<THREE.MeshBasicMaterial>(null)
    const [opacity, setOpacity] = useState(0)
    const startGame = useGameStore((state) => state.startGame)
    const texture = useLoader(TextureLoader, '/Fox-Heaven.png')

    useEffect(() => {
        // Fade in
        let fadeInProgress = 0
        const fadeInInterval = setInterval(() => {
            fadeInProgress += 0.02
            setOpacity(Math.min(fadeInProgress, 1))
            if (fadeInProgress >= 1) {
                clearInterval(fadeInInterval)

                // Start fade out after 4 seconds (total 5 seconds display)
                setTimeout(() => {
                    let fadeOutProgress = 1
                    const fadeOutInterval = setInterval(() => {
                        fadeOutProgress -= 0.02
                        setOpacity(Math.max(fadeOutProgress, 0))
                        if (fadeOutProgress <= 0) {
                            clearInterval(fadeOutInterval)
                            startGame()
                        }
                    }, 16)
                }, 4000)
            }
        }, 16)

        return () => clearInterval(fadeInInterval)
    }, [startGame])

    useFrame(() => {
        if (materialRef.current) {
            materialRef.current.opacity = opacity
        }
    })

    return (
        <mesh ref={meshRef} position={[0, 3, 0]} renderOrder={999}>
            <planeGeometry args={[8, 3]} />
            <meshBasicMaterial
                ref={materialRef}
                map={texture}
                transparent
                opacity={opacity}
                depthWrite={false}
                depthTest={false}
            />
        </mesh>
    )
}
