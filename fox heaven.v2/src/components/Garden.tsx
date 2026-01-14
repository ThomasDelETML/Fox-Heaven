import { Instance, Instances, Cloud, Sky, Stars, Float, Text, useTexture } from '@react-three/drei'
import { useMemo } from 'react'

export function Garden() {
    const heartTexture = useTexture('/Heart-Shape.png')
    const flowerPositions = useMemo(() => {
        const pos = []
        const colors = ['#ff69b4', '#ffdab9', '#e6e6fa', '#fff0f5', '#dda0dd', '#ffb6c1']
        for (let i = 0; i < 60; i++) {
            pos.push({
                x: (Math.random() - 0.5) * 45,
                z: (Math.random() - 0.5) * 45,
                scale: 0.3 + Math.random() * 0.4,
                color: colors[Math.floor(Math.random() * colors.length)]
            })
        }
        return pos
    }, [])

    const grassPositions = useMemo(() => {
        const pos = []
        for (let i = 0; i < 300; i++) {
            pos.push({
                x: (Math.random() - 0.5) * 50,
                z: (Math.random() - 0.5) * 50,
                scale: 0.2 + Math.random() * 0.3,
                rotation: Math.random() * Math.PI
            })
        }
        return pos
    }, [])

    const treePositions = useMemo(() => {
        const pos = []
        for (let i = 0; i < 12; i++) {
            pos.push({
                x: (Math.random() - 0.5) * 40,
                z: (Math.random() - 0.5) * 40,
                scale: 0.8 + Math.random() * 0.6
            })
        }
        return pos
    }, [])

    const hillPositions = [
        { x: -15, z: -15, scale: [10, 2, 10] },
        { x: 15, z: -10, scale: [8, 1.5, 8] },
        { x: -10, z: 15, scale: [12, 3, 12] },
        { x: 5, z: -20, scale: [6, 1, 6] },
    ]

    return (
        <group>
            {/* Ground */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color="#5c9c5c" />
            </mesh>

            {/* Hills */}
            {hillPositions.map((pos, i) => (
                <mesh key={i} position={[pos.x, -0.5, pos.z]} scale={pos.scale as [number, number, number]}>
                    <sphereGeometry args={[1, 32, 16]} />
                    <meshStandardMaterial color="#4e8c4e" />
                </mesh>
            ))}

            {/* Lake (avoidance handled in Fox.tsx) */}
            <group position={[12, 0.02, 12]}>
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                    <circleGeometry args={[7, 32]} />
                    <meshStandardMaterial color="#4fa3e3" transparent opacity={0.8} />
                </mesh>
                {/* Shore */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
                    <circleGeometry args={[7.5, 32]} />
                    <meshStandardMaterial color="#8b7355" />
                </mesh>
            </group>

            {/* Sky & Atmosphere */}
            <Sky sunPosition={[100, 20, 100]} turbidity={0.5} rayleigh={0.5} />
            <Cloud opacity={0.5} speed={0.4} position={[0, 10, -10]} />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            {/* Trees */}
            {treePositions.map((pos, i) => {
                // Avoid lake
                if (Math.sqrt(Math.pow(pos.x - 12, 2) + Math.pow(pos.z - 12, 2)) < 9) return null
                return (
                    <group key={i} position={[pos.x, 0, pos.z]} scale={pos.scale}>
                        {/* Trunk */}
                        <mesh position={[0, 1, 0]} castShadow>
                            <cylinderGeometry args={[0.2, 0.4, 2]} />
                            <meshStandardMaterial color="#5c4033" />
                        </mesh>
                        {/* Foliage */}
                        <mesh position={[0, 2.5, 0]} castShadow>
                            <coneGeometry args={[1.5, 3, 8]} />
                            <meshStandardMaterial color="#2d5a27" />
                        </mesh>
                        <mesh position={[0, 3.5, 0]} castShadow>
                            <coneGeometry args={[1.2, 2.5, 8]} />
                            <meshStandardMaterial color="#3e7a36" />
                        </mesh>
                    </group>
                )
            })}

            {/* Grass (Low grasses) */}
            <Instances range={300}>
                <boxGeometry args={[0.1, 0.4, 0.1]} />
                <meshStandardMaterial color="#4e8c4e" />
                {grassPositions.map((pos, i) => {
                    // Avoid lake
                    if (Math.sqrt(Math.pow(pos.x - 12, 2) + Math.pow(pos.z - 12, 2)) < 8) return null
                    return (
                        <Instance
                            key={i}
                            position={[pos.x, 0.1, pos.z]}
                            scale={pos.scale}
                            rotation={[0, pos.rotation, 0]}
                        />
                    )
                })}
            </Instances>

            {/* Flowers */}
            <group>
                {flowerPositions.map((pos, i) => {
                    // Avoid lake
                    if (Math.sqrt(Math.pow(pos.x - 12, 2) + Math.pow(pos.z - 12, 2)) < 8) return null
                    return (
                        <group key={i} position={[pos.x, 0, pos.z]} scale={pos.scale}>
                            {/* Stem */}
                            <mesh position={[0, 0.15, 0]}>
                                <boxGeometry args={[0.05, 0.3, 0.05]} />
                                <meshStandardMaterial color="green" />
                            </mesh>
                            {/* Blossom */}
                            <mesh position={[0, 0.35, 0]}>
                                <sphereGeometry args={[0.15, 6, 6]} />
                                <meshStandardMaterial color={pos.color} />
                            </mesh>
                        </group>
                    )
                })}
            </group>

            {/* Memorial Heart */}
            <group position={[6, 1.2, 6]} rotation={[0, -Math.PI / 4, 0]}>
                <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                    {/* Heart Image */}
                    <mesh scale={1.2}>
                        <planeGeometry args={[1, 1]} />
                        <meshBasicMaterial map={heartTexture} transparent alphaTest={0.5} />
                    </mesh>

                    {/* Inscription */}
                    <Text
                        position={[0, 0.8, 0]}
                        fontSize={0.25}
                        color="white"
                        anchorX="center"
                        anchorY="middle"
                        outlineWidth={0.02}
                        outlineColor="#830000"
                    >
                        21.12.2022 - forever
                    </Text>
                </Float>
            </group>
        </group>
    )
}

