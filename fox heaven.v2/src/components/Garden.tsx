import { Instance, Instances, Cloud, Sky, Stars } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'

export function Garden() {
    const flowerPositions = useMemo(() => {
        const pos = []
        for (let i = 0; i < 50; i++) {
            pos.push({
                x: (Math.random() - 0.5) * 40,
                z: (Math.random() - 0.5) * 40,
                scale: 0.5 + Math.random() * 0.5
            })
        }
        return pos
    }, [])

    const treePositions = useMemo(() => {
        const pos = []
        for (let i = 0; i < 15; i++) {
            pos.push({
                x: (Math.random() - 0.5) * 35,
                z: (Math.random() - 0.5) * 35,
                scale: 0.8 + Math.random() * 0.6
            })
        }
        return pos
    }, [])

    return (
        <group>
            {/* Ground */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color="#5c9c5c" />
            </mesh>

            {/* Sky & Atmosphere */}
            <Sky sunPosition={[100, 20, 100]} turbidity={0.5} rayleigh={0.5} />
            <Cloud opacity={0.5} speed={0.4} width={10} depth={1.5} segments={20} position={[0, 10, -10]} />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            {/* Lighting is handled in App.tsx but we can add local decorations */}

            {/* Trees */}
            {treePositions.map((pos, i) => (
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
            ))}

            {/* Flowers (Instances for performance) */}
            <Instances range={50}>
                <sphereGeometry args={[0.2, 8, 8]} />
                <meshStandardMaterial color="pink" />
                {flowerPositions.map((pos, i) => (
                    <Instance key={i} position={[pos.x, 0.2, pos.z]} scale={pos.scale} color={Math.random() > 0.5 ? 'yellow' : 'pink'} />
                ))}
            </Instances>
        </group>
    )
}
