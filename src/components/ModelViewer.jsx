"use client";

import React, { Suspense, useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera, useGLTF } from '@react-three/drei';
import './ModelViewer.css';

function Model({ modelPath, onLoaded }) {
  const { scene } = useGLTF(modelPath);
  
  // Notificar cuando el modelo se ha cargado - con verificación de tipo
  useEffect(() => {
    if (scene) {
      // Verificar que onLoaded es una función antes de llamarla
      if (typeof onLoaded === 'function') {
        onLoaded();
      }
    }
  }, [scene, onLoaded]);
  
  return <primitive object={scene} />;
}

const ModelViewer = ({ modelPath, modelName }) => {
  const [loading, setLoading] = useState(true);

  // Memoizar la función de callback para evitar recreaciones
  const handleModelLoaded = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <div className="model-viewer">
      {loading && (
        <div className="model-viewer__loading">Cargando modelo...</div>
      )}
      
      <Canvas className="model-viewer__canvas" dpr={[1, 2]}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <Stage environment="city" intensity={0.6}>
            <Model modelPath={modelPath} onLoaded={handleModelLoaded} />
          </Stage>
          <OrbitControls 
            autoRotate 
            autoRotateSpeed={0.1}
            enableZoom={true}
            enablePan={true}
            minDistance={1}
            maxDistance={100}
          />
          <ambientLight intensity={0.5} />
        </Suspense>
      </Canvas>
      
      <div className="model-viewer__controls">
        <h3 className="model-viewer__model-name">{modelName}</h3>
        <div className="model-viewer__instructions">
          <p>Usa el ratón para interactuar:</p>
          <ul>
            <li>Arrastrar: Rotar el modelo</li>
            <li>Scroll: Zoom in/out</li>
            <li>Click derecho + arrastrar: Mover el modelo</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ModelViewer;
