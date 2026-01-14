import { Text } from '@react-three/drei'
import { useGameStore } from '../store'

export function CuddlesCounter() {
    const cuddleCount = useGameStore((state) => state.cuddleCount)

    return (
        <group>
            {/* Fox emoji */}
            <Text
                position={[-4.3, 4.5, 0.01]}
                fontSize={0.4}
                color="#d46a2e"
                anchorX="center"
                anchorY="middle"
                renderOrder={999}
            >
                🦊
            </Text>

            {/* Cuddles text */}
            <Text
                position={[-3.5, 4.5, 0.01]}
                fontSize={0.3}
                color="#d46a2e"
                anchorX="left"
                anchorY="middle"
                renderOrder={999}
            >
                Cuddles: {cuddleCount}
            </Text>
        </group>
    )
}
