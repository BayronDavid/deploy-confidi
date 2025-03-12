'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { OrbitControls, PerspectiveCamera, Environment, SpotLight } from '@react-three/drei';
import Experience from './Experience';
import { useScrollContext } from '@/context/ScrollContext';
import useMousePosition from '@/hooks/useMousePosition';

const Scene = () => {
  const { scrollProgress } = useScrollContext();
  const mousePosition = useMousePosition();
  
  return (
    <div className="canvas-container">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.2} /> {/* Reduced light intensity for subtlety */}
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={0.6} 
          castShadow 
          shadow-mapSize-width={1024} 
          shadow-mapSize-height={1024}
        />
        {/* Added spotlight for more dramatic lighting on the butterfly */}
        <SpotLight
          position={[0, 5, 2]}
          angle={0.6}
          penumbra={0.5}
          intensity={0.8}
          castShadow
          shadow-bias={-0.0001}
        />
        {/* Added point light for fill lighting */}
        <pointLight position={[-5, 2, -2]} intensity={0.5} color="#ffffff" />
        <Suspense fallback={null}>
          <Experience 
            scrollProgress={scrollProgress} 
            mousePosition={mousePosition} 
          />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          enableRotate={false} 
        />
      </Canvas>
    </div>
  );
};

export default Scene;
