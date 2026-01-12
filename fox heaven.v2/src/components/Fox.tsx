import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Float, Html } from '@react-three/drei'

// Fox States
type FoxState = 'idle' | 'walking' | 'cuddle'

export function Fox({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
    const group = useRef<THREE.Group>(null)
    const [state, setState] = useState<FoxState>('walking')
    const [showHearts, setShowHearts] = useState(false)

    // Random movement target
    const target = useRef(new THREE.Vector3(
        position[0] + (Math.random() - 0.5) * 10,
        0,
        position[2] + (Math.random() - 0.5) * 10
    ))

    useFrame((state, delta) => {
        if (!group.current) return

        if (state === 'walking') {
            // Move towards target
            const currentPos = group.current.position
            const dir = new THREE.Vector3().subVectors(target.current, currentPos).normalize()

            // Rotate to face direction
            const angle = Math.atan2(dir.x, dir.z)
            group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, angle, delta * 5)

            // Move
            const speed = 2
            group.current.position.add(dir.multiplyScalar(speed * delta))

            // Bobbing animation for walking
            group.current.position.y = Math.sin(state.clock.elapsedTime * 10) * 0.1

            // Check if reached target
            if (currentPos.distanceTo(target.current) < 0.5) {
                // New random target
                target.current.set(
                    (Math.random() - 0.5) * 20,
                    0,
                    (Math.random() - 0.5) * 20
                )
            }
        } else if (state === 'cuddle') {
            // Look at camera?
            // group.current.lookAt(state.camera.position)
            // Jump / Happy animation
            group.current.position.y = Math.abs(Math.sin(state.clock.elapsedTime * 10)) * 0.5
        }
    })

    const interact = () => {
        setState('cuddle')
        setShowHearts(true)
        setTimeout(() => {
            setState('walking')
            setShowHearts(false)
        }, 3000)
    }

    return (
        <group ref={group} position={position} onClick={interact} onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
            {/* Visual Body */}
            <group>
                {/* Main Body */}
                <mesh position={[0, 0.5, 0]} castShadow>
                    <boxGeometry args={[0.6, 0.5, 1]} />
                    <meshStandardMaterial color="#d46a2e" />
                </mesh>
                {/* Head */}
                <mesh position={[0, 0.9, 0.5]} castShadow>
                    <boxGeometry args={[0.5, 0.5, 0.6]} />
                    <meshStandardMaterial color="#d46a2e" />
                </mesh>
                {/* Snout */}
                <mesh position={[0, 0.8, 0.85]}>
                    <boxGeometry args={[0.2, 0.2, 0.3]} />
                    <meshStandardMaterial color="white" />
                </mesh>
                <mesh position={[0, 0.95, 0.95]}>
                    <sphereGeometry args={[0.05]} />
                    <meshStandardMaterial color="black" />
                </mesh>
                {/* Ears */}
                <mesh position={[0.15, 1.2, 0.5]}>
                    <coneGeometry args={[0.1, 0.3, 4]} />
                    <meshStandardMaterial color="#d46a2e" />
                </mesh>
                <mesh position={[-0.15, 1.2, 0.5]}>
                    <coneGeometry args={[0.1, 0.3, 4]} />
                    <meshStandardMaterial color="#d46a2e" />
                </mesh>
                {/* Tail */}
                <mesh position={[0, 0.6, -0.6]} rotation={[0.5, 0, 0]}>
                    <boxGeometry args={[0.2, 0.2, 0.8]} />
                    <meshStandardMaterial color="#d46a2e" />
                </mesh>
                {/* Tail Tip */}
                <mesh position={[0, 0.65, -1.0]} rotation={[0.5, 0, 0]}>
                    <boxGeometry args={[0.15, 0.15, 0.3]} />
                    <meshStandardMaterial color="white" />
                </mesh>

                {/* Legs */}
                <mesh position={[0.2, 0.15, 0.3]}>
                    <boxGeometry args={[0.15, 0.4, 0.15]} />
                    <meshStandardMaterial color="black" />
                </mesh>
                <mesh position={[-0.2, 0.15, 0.3]}>
                    <boxGeometry args={[0.15, 0.4, 0.15]} />
                    <meshStandardMaterial color="black" />
                </mesh>
                <mesh position={[0.2, 0.15, -0.3]}>
                    <boxGeometry args={[0.15, 0.4, 0.15]} />
                    <meshStandardMaterial color="black" />
                </mesh>
                <mesh position={[-0.2, 0.15, -0.3]}>
                    <boxGeometry args={[0.15, 0.4, 0.15]} />
                    <meshStandardMaterial color="black" />
                </mesh>
            </group>

            {/* Hearts Effect */}
            {showHearts && (
                <Float speed={5} rotationIntensity={0} floatIntensity={2}>
                    <Html postition={[0, 2, 0]} center>
                        <div className="text-4xl">❤️❤️❤️</div>
                    </Html>
                </Float>
            )}
        </group>
    )
}
