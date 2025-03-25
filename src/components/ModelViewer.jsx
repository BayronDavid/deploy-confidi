"use client";

import React, { Suspense, useState, useEffect, useCallback, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera, useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import './ModelViewer.css';

function Model({ modelPath, onLoaded, animationIndex, playing, animationSpeed, lightIntensity, lightColor, envIntensity, backgroundColor }) {
  const { scene, animations } = useGLTF(modelPath);
  const { animationNames, mixer, actions, names } = useAnimations(animations, scene);
  const currentAction = useRef(null);
  const { gl } = useThree();
  
  // Set background color to the specified color
  useEffect(() => {
    gl.setClearColor(backgroundColor);
  }, [gl, backgroundColor]);

  // Handle animation changes
  useEffect(() => {
    // Reset current animation if any
    if (currentAction.current) {
      currentAction.current.fadeOut(0.5);
    }
    
    // No animations or invalid index
    if (!actions || actions.length === 0 || animationIndex < 0) {
      currentAction.current = null;
      return;
    }
    
    // Get new action and configure it
    const actionNames = Object.keys(actions);
    if (animationIndex < actionNames.length) {
      const newAction = actions[actionNames[animationIndex]];
      if (newAction) {
        newAction.reset()
          .setEffectiveTimeScale(animationSpeed)
          .setLoop(THREE.LoopRepeat, Infinity);
        
        if (playing) {
          newAction.play().fadeIn(0.5);
        } else {
          newAction.paused = true;
          newAction.play();
        }
        
        currentAction.current = newAction;
      }
    }
  }, [actions, animationIndex, playing, animationSpeed]);
  
  // Update animation speed when it changes
  useEffect(() => {
    if (currentAction.current) {
      currentAction.current.setEffectiveTimeScale(animationSpeed);
    }
  }, [animationSpeed]);
  
  // Update mixer on each frame
  useFrame((state, delta) => {
    if (mixer) mixer.update(delta);
  });
  
  // Notify when loaded
  useEffect(() => {
    if (scene) {
      if (typeof onLoaded === 'function') {
        onLoaded({ 
          hasAnimations: animations && animations.length > 0, 
          animationCount: animations ? animations.length : 0,
          animationNames: names || []
        });
      }
    }
  }, [scene, animations, names, onLoaded]);
  
  return <primitive object={scene} />;
}

const ModelViewer = ({ modelPath, modelName }) => {
  const [loading, setLoading] = useState(true);
  const [modelInfo, setModelInfo] = useState({ hasAnimations: false, animationCount: 0, animationNames: [] });
  const [showControls, setShowControls] = useState(false);
  
  // Animation states
  const [selectedAnimation, setSelectedAnimation] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1.0);
  
  // Lighting states
  const [ambientIntensity, setAmbientIntensity] = useState(0.5);
  const [envIntensity, setEnvIntensity] = useState(0.6);
  const [lightColor, setLightColor] = useState("#ffffff");
  const [backgroundColor, setBackgroundColor] = useState("#444444"); // Default dark gray background
  
  // Camera states
  const [autoRotate, setAutoRotate] = useState(true);
  const [autoRotateSpeed, setAutoRotateSpeed] = useState(0.1);
  
  // Handle model loaded
  const handleModelLoaded = useCallback((info) => {
    setLoading(false);
    setModelInfo(info);
  }, []);
  
  // Toggle animation playback
  const togglePlay = () => {
    if (modelInfo.hasAnimations && selectedAnimation >= 0) {
      setIsPlaying(prev => !prev);
    }
  };
  
  return (
    <div className="model-viewer">
      {loading && (
        <div className="model-viewer__loading">Cargando modelo...</div>
      )}
      
      {showControls ? (
        <div className="model-viewer__advanced-controls">
          {/* Animation Controls */}
          <div className="control-section">
            <h4>Animaciones</h4>
            {modelInfo.hasAnimations ? (
              <>
                <div className="control-row">
                  <label>Seleccionar:</label>
                  <select 
                    value={selectedAnimation}
                    onChange={(e) => {
                      setSelectedAnimation(Number(e.target.value));
                      setIsPlaying(true);
                    }}
                  >
                    <option value={-1}>Ninguna</option>
                    {modelInfo.animationNames.map((name, index) => (
                      <option key={index} value={index}>{name}</option>
                    ))}
                  </select>
                </div>
                
                {selectedAnimation >= 0 && (
                  <>
                    <div className="control-row">
                      <label>Velocidad: {animationSpeed.toFixed(1)}x</label>
                      <input 
                        type="range" 
                        min="0.1" 
                        max="2" 
                        step="0.1" 
                        value={animationSpeed}
                        onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                      />
                    </div>
                    
                    <div className="animation-controls">
                      <button onClick={togglePlay}>
                        {isPlaying ? 'Pausar' : 'Reproducir'}
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <p>Este modelo no tiene animaciones</p>
            )}
          </div>
          
          {/* Lighting Controls */}
          <div className="control-section">
            <h4>Iluminación</h4>
            <div className="control-row">
              <label>Ambiente: {ambientIntensity.toFixed(1)}</label>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.1" 
                value={ambientIntensity}
                onChange={(e) => setAmbientIntensity(parseFloat(e.target.value))}
              />
            </div>
            
            <div className="control-row">
              <label>Entorno: {envIntensity.toFixed(1)}</label>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.1" 
                value={envIntensity}
                onChange={(e) => setEnvIntensity(parseFloat(e.target.value))}
              />
            </div>
            
            <div className="control-row">
              <label>Color de luz:</label>
              <input 
                type="color" 
                value={lightColor}
                onChange={(e) => setLightColor(e.target.value)}
              />
            </div>
            
            <div className="control-row">
              <label>Color de fondo:</label>
              <input 
                type="color" 
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
              />
            </div>
          </div>
          
          {/* Camera Controls */}
          <div className="control-section">
            <h4>Cámara</h4>
            <div className="control-row">
              <label>Auto-rotar</label>
              <input 
                type="checkbox" 
                checked={autoRotate}
                onChange={(e) => setAutoRotate(e.target.checked)}
              />
            </div>
            
            {autoRotate && (
              <div className="control-row">
                <label>Velocidad: {autoRotateSpeed.toFixed(1)}</label>
                <input 
                  type="range" 
                  min="0.1" 
                  max="5" 
                  step="0.1" 
                  value={autoRotateSpeed}
                  onChange={(e) => setAutoRotateSpeed(parseFloat(e.target.value))}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <button className="toggle-controls" onClick={() => setShowControls(true)}>
          Mostrar controles
        </button>
      )}
      
      {showControls && (
        <button className="toggle-controls" onClick={() => setShowControls(false)}>
          Ocultar controles
        </button>
      )}
      
      <Canvas className="model-viewer__canvas" dpr={[1, 2]}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <Stage environment="city" intensity={envIntensity}>
            <Model 
              modelPath={modelPath} 
              onLoaded={handleModelLoaded} 
              animationIndex={selectedAnimation}
              playing={isPlaying}
              animationSpeed={animationSpeed}
              envIntensity={envIntensity}
              lightColor={lightColor}
              backgroundColor={backgroundColor}
            />
          </Stage>
          <OrbitControls 
            autoRotate={autoRotate}
            autoRotateSpeed={autoRotateSpeed}
            enableZoom={true}
            enablePan={true}
            minDistance={1}
            maxDistance={1000}
          />
          <ambientLight intensity={ambientIntensity} color={lightColor} />
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
