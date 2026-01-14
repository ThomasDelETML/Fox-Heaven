import { Canvas } from '@react-three/fiber'
import { OrbitControls, SoftShadows } from '@react-three/drei'
import { Suspense } from 'react'
import { Garden } from './components/Garden'
import { Fox } from './components/Fox'
import { IntroLogo } from './components/IntroLogo'
import { CuddlesCounter } from './components/CuddlesCounter'
import { useGameStore } from './store'

function App() {
    const gameState = useGameStore((state) => state.gameState)

    return (
        <div className="w-full h-screen bg-[#87CEEB] overflow-hidden select-none">
            <Canvas shadows camera={{ position: [0, 2, 8], fov: 60 }}>
                <Suspense fallback={null}>
                    {/* Atmosphere & Lighting */}
                    <color attach="background" args={['#87CEEB']} />
                    <ambientLight intensity={0.6} />
                    <directionalLight
                        position={[10, 20, 10]}
                        intensity={1.5}
                        castShadow
                        shadow-mapSize={[1024, 1024]}
                    >
                        <orthographicCamera attach="shadow-camera" args={[-20, 20, 20, -20]} />
                    </directionalLight>
                    <SoftShadows size={10} samples={10} focus={0} />

                    {/* World */}
                    <Garden />

                    {/* Characters */}
                    <Fox position={[2, 0, 2]} />
                    <Fox position={[-3, 0, 1]} />
                    <Fox position={[0, 0, -4]} />
                    <Fox position={[4, 0, -2]} />
                    <Fox position={[-2, 0, -5]} />
                    <Fox position={[1, 0, 5]} />

                    {/* Intro Logo in 3D */}
                    {gameState === 'INTRO' && <IntroLogo />}

                    {/* Cuddles Counter in 3D */}
                    {gameState === 'PLAYING' && <CuddlesCounter />}

                    {/* Controls */}
                    <OrbitControls
                        target={[0, 1, 0]}
                        maxPolarAngle={Math.PI / 2 - 0.1} // Prevent going under ground
                        minDistance={2}
                        maxDistance={15}
                    />
                </Suspense>
            </Canvas>
        </div>
    )
}

export default App
