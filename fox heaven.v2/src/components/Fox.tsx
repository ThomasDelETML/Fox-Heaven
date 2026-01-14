import { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Float, Html } from '@react-three/drei'
import { useGameStore } from '../store'

// Fox States
type FoxState = 'idle' | 'walking' | 'cuddle' | 'sitting' | 'sleeping' | 'interacting'

export function Fox({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
    const id = useMemo(() => Math.random().toString(36).substring(7), [])
    const group = useRef<THREE.Group>(null)
    const [foxState, setFoxState] = useState<FoxState>('walking')
    const [showHearts, setShowHearts] = useState(false)
    const [showSocial, setShowSocial] = useState<string | null>(null)

    const incrementCuddle = useGameStore((state) => state.incrementCuddle)
    const updateFox = useGameStore((state) => state.updateFox)
    const removeFox = useGameStore((state) => state.removeFox)
    const otherFoxes = useGameStore((state) => state.foxes)

    // Random movement target
    const target = useRef(new THREE.Vector3(
        position[0] + (Math.random() - 0.5) * 10,
        0,
        position[2] + (Math.random() - 0.5) * 10
    ))

    // Handle cleanup on unmount
    useEffect(() => {
        return () => removeFox(id)
    }, [id, removeFox])

    // Behavior timer
    useEffect(() => {
        const interval = setInterval(() => {
            // Don't change state if being cuddled or interacting
            if (foxState === 'cuddle' || foxState === 'interacting') return

            const rand = Math.random()
            if (rand < 0.5) {
                setFoxState('walking')
                // New random target when starting to walk
                target.current.set(
                    (Math.random() - 0.5) * 20,
                    0,
                    (Math.random() - 0.5) * 20
                )
            } else if (rand < 0.7) {
                setFoxState('sitting')
            } else if (rand < 0.85) {
                setFoxState('idle')
            } else {
                setFoxState('sleeping')
            }
        }, 4000 + Math.random() * 4000)

        return () => clearInterval(interval)
    }, [foxState])

    const lastUpdatePos = useRef(new THREE.Vector3(...position))
    const lakePos = new THREE.Vector3(12, 0, 12)
    const lakeRadius = 7.5

    // Hill obstacles from Garden.tsx
    const obstacles = [
        { pos: new THREE.Vector3(-15, 0, -15), radius: 5 },
        { pos: new THREE.Vector3(15, 0, -10), radius: 4 },
        { pos: new THREE.Vector3(-10, 0, 15), radius: 6 },
        { pos: new THREE.Vector3(5, 0, -20), radius: 3 },
        { pos: lakePos, radius: lakeRadius }
    ]

    useFrame((state, delta) => {
        if (!group.current) return

        // Update our position in the global store only if we moved enough to reduce re-renders
        const currentPos = group.current.position
        if (currentPos.distanceTo(lastUpdatePos.current) > 0.2) {
            updateFox(id, [currentPos.x, currentPos.y, currentPos.z])
            lastUpdatePos.current.copy(currentPos)
        }

        if (foxState === 'walking') {
            // Move towards target
            const dir = new THREE.Vector3().subVectors(target.current, currentPos).setY(0).normalize()

            // Obstacle avoidance (Lake + Hills)
            obstacles.forEach(obs => {
                const dist = currentPos.distanceTo(obs.pos)
                if (dist < obs.radius + 1.5) {
                    const pushDir = new THREE.Vector3().subVectors(currentPos, obs.pos).normalize()
                    dir.add(pushDir.multiplyScalar(3)).normalize()

                    if (dist < obs.radius) {
                        target.current.set(
                            (Math.random() - 0.5) * 20,
                            0,
                            (Math.random() - 0.5) * 20
                        )
                    }
                }
            })

            // Rotate to face direction
            const angle = Math.atan2(dir.x, dir.z)
            group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, angle, delta * 5)
            // Reset any tilt from sleeping/sitting
            group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, 0, delta * 5)
            group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, 0, delta * 5)

            // Move
            const speed = 1.2
            group.current.position.add(dir.multiplyScalar(speed * delta))

            // Bobbing animation for walking
            group.current.position.y = Math.sin(state.clock.elapsedTime * 10) * 0.1

            // Check if reached target
            if (currentPos.distanceTo(target.current) < 1) {
                setFoxState('idle')
            }

            // Social interaction check - if another fox is nearby
            Object.entries(otherFoxes).forEach(([otherId, otherPos]) => {
                if (otherId === id) return
                const otherVec = new THREE.Vector3(...otherPos)
                // Reduced frequency (0.003) and distance (1.5)
                if (currentPos.distanceTo(otherVec) < 1.5 && Math.random() < 0.003) {
                    setFoxState('interacting')
                    setShowSocial('!')
                    // Look at the other fox
                    const lookDir = new THREE.Vector3().subVectors(otherVec, currentPos).setY(0).normalize()
                    group.current!.rotation.y = Math.atan2(lookDir.x, lookDir.z)

                    setTimeout(() => {
                        setFoxState('idle')
                        setShowSocial(null)
                    }, 4000)
                }
            })
        } else if (foxState === 'cuddle') {
            // Jump animation
            group.current.position.y = Math.abs(Math.sin(state.clock.elapsedTime * 10)) * 0.5
            group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, 0, delta * 5)
        } else if (foxState === 'interacting') {
            // Social bobbing (happy jump)
            group.current.position.y = Math.abs(Math.sin(state.clock.elapsedTime * 12)) * 0.3
        } else if (foxState === 'sitting' || foxState === 'sleeping') {
            // Combined sitting/sleeping into a more upright pose instead of lying on ground
            group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, -0.15, delta * 4)
            group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -0.15, delta * 4)
            group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, 0, delta * 4)
        } else {
            // Idle standing
            group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, 0, delta * 4)
            group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, 0, delta * 4)
            group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, 0, delta * 4)
        }
    })

    const interact = () => {
        if (foxState === 'sleeping') setShowSocial(null)
        setFoxState('cuddle')
        setShowHearts(true)
        incrementCuddle()
        setTimeout(() => {
            setFoxState('idle')
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

                {/* Eyes - normal, happy, or sleeping */}
                {foxState === 'cuddle' ? (
                    <>
                        {/* Happy eyes ^ ^ - 90 degree angle at top, closer together */}
                        {/* Right eye ^ */}
                        <mesh position={[0.065, 1.05, 0.81]} rotation={[0, 0, 0.785]}>
                            <boxGeometry args={[0.1, 0.03, 0.03]} />
                            <meshStandardMaterial color="black" />
                        </mesh>
                        <mesh position={[0.135, 1.05, 0.81]} rotation={[0, 0, -0.785]}>
                            <boxGeometry args={[0.1, 0.03, 0.03]} />
                            <meshStandardMaterial color="black" />
                        </mesh>
                        {/* Left eye ^ */}
                        <mesh position={[-0.135, 1.05, 0.81]} rotation={[0, 0, 0.785]}>
                            <boxGeometry args={[0.1, 0.03, 0.03]} />
                            <meshStandardMaterial color="black" />
                        </mesh>
                        <mesh position={[-0.065, 1.05, 0.81]} rotation={[0, 0, -0.785]}>
                            <boxGeometry args={[0.1, 0.03, 0.03]} />
                            <meshStandardMaterial color="black" />
                        </mesh>
                    </>
                ) : foxState === 'sleeping' ? (
                    <>
                        {/* Sleeping eyes - closed lines */}
                        <mesh position={[0.12, 0.95, 0.78]}>
                            <boxGeometry args={[0.12, 0.02, 0.02]} />
                            <meshStandardMaterial color="black" />
                        </mesh>
                        <mesh position={[-0.12, 0.95, 0.78]}>
                            <boxGeometry args={[0.12, 0.02, 0.02]} />
                            <meshStandardMaterial color="black" />
                        </mesh>
                    </>
                ) : (
                    <>
                        {/* Normal eyes */}
                        <mesh position={[0.15, 1.0, 0.81]}>
                            <sphereGeometry args={[0.06]} />
                            <meshStandardMaterial color="black" />
                        </mesh>
                        <mesh position={[-0.15, 1.0, 0.81]}>
                            <sphereGeometry args={[0.06]} />
                            <meshStandardMaterial color="black" />
                        </mesh>
                    </>
                )}

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
                {/* Tail Tip - aligned with tail rotation */}
                <mesh position={[0, 0.79, -0.95]} rotation={[0.5, 0, 0]}>
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

            {/* Social Indicators (zZz, !) */}
            {(showSocial || foxState === 'sleeping') && (
                <Html position={[0, 1.5, 0]} center>
                    <div className="text-2xl select-none pointer-events-none">
                        {foxState === 'sleeping' ? '💤' : showSocial}
                    </div>
                </Html>
            )}

            {/* Hearts Effect */}
            {showHearts && (
                <Float speed={5} rotationIntensity={0} floatIntensity={2}>
                    <Html position={[0, 2, 0]} center>
                        <div className="text-4xl">❤️❤️❤️</div>
                    </Html>
                </Float>
            )}
        </group>
    )
}
