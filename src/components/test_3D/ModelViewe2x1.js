"use client";

import React, { Suspense, useState, useEffect, useCallback, useRef } from 'react';
import { Canvas, useThree, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera, useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import './ModelViewer.css';

// TextureDebugger component to log texture information
function TextureDebugger({ children, modelPath }) {
    const { scene } = useGLTF(modelPath);

    useEffect(() => {
        // Function to traverse the scene and find materials with textures
        const findTextures = (obj) => {
            console.log('Analyzing object:', obj.name || 'unnamed object');

            if (obj.material) {
                console.log('Material found:', obj.material.name || 'unnamed material');

                // Check for standard material properties
                const material = obj.material;

                if (material.map) console.log(' - Diffuse/Base texture:', material.map.name || material.map.source?.data?.src || 'unnamed texture');
                if (material.normalMap) console.log(' - Normal map:', material.normalMap.name || material.normalMap.source?.data?.src || 'unnamed texture');
                if (material.roughnessMap) console.log(' - Roughness map:', material.roughnessMap.name || material.roughnessMap.source?.data?.src || 'unnamed texture');
                if (material.metalnessMap) console.log(' - Metalness map:', material.metalnessMap.name || material.metalnessMap.source?.data?.src || 'unnamed texture');
                if (material.aoMap) console.log(' - Ambient Occlusion map:', material.aoMap.name || material.aoMap.source?.data?.src || 'unnamed texture');
                if (material.emissiveMap) console.log(' - Emissive map:', material.emissiveMap.name || material.emissiveMap.source?.data?.src || 'unnamed texture');
                if (material.specularMap) console.log(' - Specular map:', material.specularMap.name || material.specularMap.source?.data?.src || 'unnamed texture');
                if (material.bumpMap) console.log(' - Bump map:', material.bumpMap.name || material.bumpMap.source?.data?.src || 'unnamed texture');
                if (material.displacementMap) console.log(' - Displacement map:', material.displacementMap.name || material.displacementMap.source?.data?.src || 'unnamed texture');

                // Check for any other textures stored in material
                for (const prop in material) {
                    if (
                        material[prop] &&
                        material[prop] instanceof THREE.Texture &&
                        ![
                            'map',
                            'normalMap',
                            'roughnessMap',
                            'metalnessMap',
                            'aoMap',
                            'emissiveMap',
                            'specularMap',
                            'bumpMap',
                            'displacementMap'
                        ].includes(prop)
                    ) {
                        console.log(` - Other texture (${prop}):`, material[prop].name || material[prop].source?.data?.src || 'unnamed texture');
                    }
                }
            }

            // Recursively check children
            if (obj.children && obj.children.length > 0) {
                obj.children.forEach(child => findTextures(child));
            }
        };

        if (scene) {
            console.log('----------- TEXTURE DEBUG INFO -----------');
            console.log('Model path:', modelPath);
            console.log('Analyzing textures in the model:');
            findTextures(scene);
            console.log('Total objects in scene:', scene.children.length);
            console.log('----------------------------------------');
        }
    }, [scene, modelPath]);

    // Just render children without modifying them
    return <>{children}</>;
}

/**
 * Función auxiliar que inyecta la lógica UDIM en un MeshStandardMaterial,
 * reemplazando la parte de "map_fragment" para usar dos texturas:
 *  - tile1 para UV.x < 1.0
 *  - tile2 para UV.x >= 1.0 (con offset)
 */
function applyUDIMShader(material, tile1, tile2) {
    // Imprimimos información sobre las texturas para depuración
    console.log("Aplicando shader UDIM con texturas:", 
        tile1 ? "Tile1 OK" : "Tile1 missing", 
        tile2 ? "Tile2 OK" : "Tile2 missing");
    
    material.customProgramCacheKey = () => 'udimShader'; // Evita problemas de caché del shader
    
    material.onBeforeCompile = (shader) => {
        console.log("Compilando shader UDIM...");
        
        // Añadimos uniforms
        shader.uniforms.tile1 = { value: tile1 };
        shader.uniforms.tile2 = { value: tile2 };

        // Insertamos las declaraciones de uniforms antes del código del fragment shader
        shader.fragmentShader = shader.fragmentShader.replace(
            'void main() {',
            `
uniform sampler2D tile1;
uniform sampler2D tile2;

void main() {`
        );

        // Encontrar qué variable de UV está usando Three.js para el mapa difuso
        // Log para depuración - busca variables que contengan "map" y "uv"
        let uvVarName = "vMapUv"; // Nombre por defecto en Three.js r151+
        const uvMatches = shader.fragmentShader.match(/v[A-Za-z]*MapUv/);
        if (uvMatches && uvMatches.length > 0) {
            uvVarName = uvMatches[0];
            console.log("Variable UV encontrada:", uvVarName);
        } else {
            console.warn("No se pudo detectar la variable UV, usando fallback:", uvVarName);
        }

        // Versión compatible para Three.js r151+
        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <map_fragment>',
            `
#ifdef USE_MAP
    vec4 sampledDiffuseColor;
    
    // Lógica UDIM: seleccionar textura según coordenada U
    if(${uvVarName}.x < 1.0) {
        sampledDiffuseColor = texture2D(tile1, ${uvVarName});
    } else {
        sampledDiffuseColor = texture2D(tile2, vec2(${uvVarName}.x - 1.0, ${uvVarName}.y));
    }
    
    // Aplicamos color y gamma si es necesario
    #ifdef DECODE_VIDEO_TEXTURE
        sampledDiffuseColor = vec4(mix(pow(sampledDiffuseColor.rgb * 0.9478672986 + vec3(0.0521327014), vec3(2.4)), sampledDiffuseColor.rgb * 0.0773993808, vec3(lessThanEqual(sampledDiffuseColor.rgb, vec3(0.04045)))), sampledDiffuseColor.w);
    #endif
    
    diffuseColor *= sampledDiffuseColor;
#endif`
        );
        
        // Imprimimos un fragmento pequeño del shader para depuración
        console.log("Shader modificado (fragmento):", 
            shader.fragmentShader.substring(0, 200) + "...");
    };
    
    // Aseguramos que el material se actualice
    material.needsUpdate = true;
}

function Model({
    modelPath,
    onLoaded,
    animationIndex,
    playing,
    animationSpeed,
    lightIntensity,
    lightColor,
    envIntensity,
    backgroundColor,
    useUDIMShader // <-- nuevo prop para activar/desactivar UDIM
}) {
    const { scene, animations } = useGLTF(modelPath);
    const { mixer, actions, names } = useAnimations(animations, scene);
    const currentAction = useRef(null);
    const { gl } = useThree();

    // Ajusta el color de fondo del render
    useEffect(() => {
        gl.setClearColor(backgroundColor);
    }, [gl, backgroundColor]);

    // Manejo de animaciones
    useEffect(() => {
        if (currentAction.current) {
            currentAction.current.fadeOut(0.5);
        }

        if (!actions || Object.keys(actions).length === 0 || animationIndex < 0) {
            currentAction.current = null;
            return;
        }

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

    // Ajustar velocidad de animación si cambia
    useEffect(() => {
        if (currentAction.current) {
            currentAction.current.setEffectiveTimeScale(animationSpeed);
        }
    }, [animationSpeed]);

    // Actualizar mixer cada frame
    useFrame((state, delta) => {
        if (mixer) mixer.update(delta);
    });

    // Notificar cuando el modelo esté cargado
    useEffect(() => {
        if (scene && typeof onLoaded === 'function') {
            onLoaded({
                hasAnimations: animations && animations.length > 0,
                animationCount: animations ? animations.length : 0,
                animationNames: names || []
            });
        }
    }, [scene, animations, names, onLoaded]);

    /**
     * Aquí cargamos nuestras dos texturas UDIM para la baseColor.
     * Usando las texturas 2x1 existentes
     */
    // Ajusta estas rutas a donde tengas las texturas
    const UDIM_TILE1 = '/BaseColor.1001.png';  // Primera textura UDIM
    const UDIM_TILE2 = '/BaseColor.1002.png';  // Segunda textura UDIM

    // Estado para las texturas
    const [textures, setTextures] = useState({ tile1: null, tile2: null });
    
    // Cargar texturas cuando se activa el modo UDIM
    useEffect(() => {
        if (!useUDIMShader) return;
        
        console.log("Cargando texturas UDIM...");
        const textureLoader = new THREE.TextureLoader();
        
        // Cargamos tile1
        textureLoader.load(
            UDIM_TILE1, 
            (texture) => {
                console.log("✅ Textura UDIM Tile1 cargada correctamente");
                texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
                setTextures(prev => ({ ...prev, tile1: texture }));
            },
            undefined, 
            (error) => console.error("❌ Error cargando textura UDIM Tile1:", error)
        );
        
        // Cargamos tile2
        textureLoader.load(
            UDIM_TILE2,
            (texture) => {
                console.log("✅ Textura UDIM Tile2 cargada correctamente");
                texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
                setTextures(prev => ({ ...prev, tile2: texture }));
            },
            undefined,
            (error) => console.error("❌ Error cargando textura UDIM Tile2:", error)
        );
        
        // Limpieza
        return () => {
            setTextures({ tile1: null, tile2: null });
        };
    }, [useUDIMShader]);

    // Efecto para activar/desactivar el UDIM shader en los materiales
    useEffect(() => {
        if (!scene) return;
        
        console.log("UDIM Shader:", useUDIMShader ? "Activado" : "Desactivado");
        
        // Solo procesar si tenemos ambas texturas o si estamos desactivando UDIM
        if ((useUDIMShader && textures.tile1 && textures.tile2) || !useUDIMShader) {
            console.log("Texturas disponibles:", 
                textures.tile1 ? "✅ Tile1" : "❌ Tile1 missing", 
                textures.tile2 ? "✅ Tile2" : "❌ Tile2 missing");
            
            scene.traverse((obj) => {
                if (obj.isMesh && obj.material) {
                    // Activar UDIM
                    if (useUDIMShader && textures.tile1 && textures.tile2) {
                        console.log(`Aplicando shader UDIM a objeto: ${obj.name}`);
                        
                        // Guarda el material original si no se ha guardado antes
                        if (!obj.userData.originalMaterial) {
                            obj.userData.originalMaterial = obj.material.clone();
                        }
                        
                        // Crear un material nuevo para evitar conflictos
                        const udimMaterial = new THREE.MeshStandardMaterial();
                        
                        // Copiamos propiedades básicas
                        const originalMaterial = obj.userData.originalMaterial;
                        udimMaterial.color.copy(originalMaterial.color || new THREE.Color(1, 1, 1));
                        udimMaterial.roughness = originalMaterial.roughness || 0.5;
                        udimMaterial.metalness = originalMaterial.metalness || 0.0;
                        udimMaterial.envMapIntensity = originalMaterial.envMapIntensity || 1.0;
                        
                        // Propiedades adicionales importantes
                        udimMaterial.alphaTest = originalMaterial.alphaTest || 0.0;
                        udimMaterial.transparent = originalMaterial.transparent || false;
                        udimMaterial.opacity = originalMaterial.opacity || 1.0;
                        
                        // Activar map para que el shader se use
                        udimMaterial.map = textures.tile1;
                        
                        // Aplica el shader UDIM personalizado
                        applyUDIMShader(udimMaterial, textures.tile1, textures.tile2);
                        
                        // Asigna el nuevo material
                        obj.material = udimMaterial;
                    } else if (!useUDIMShader) {
                        // Restaurar material original
                        if (obj.userData.originalMaterial) {
                            console.log(`Restaurando material original: ${obj.name}`);
                            obj.material = obj.userData.originalMaterial;
                        }
                    }
                }
            });
        }
    }, [scene, useUDIMShader, textures]);

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

    // ** Nuevo: toggle para el UDIM Shader **
    const [useUDIMShader, setUseUDIMShader] = useState(false);

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

                    {/* UDIM Shader Toggle */}
                    <div className="control-section">
                        <h4>Shader UDIM</h4>
                        <div className="control-row">
                            <label>Activar UDIM Shader</label>
                            <input
                                type="checkbox"
                                checked={useUDIMShader}
                                onChange={(e) => setUseUDIMShader(e.target.checked)}
                            />
                        </div>
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
                        <TextureDebugger modelPath={modelPath}>
                            <Model
                                modelPath={modelPath}
                                onLoaded={handleModelLoaded}
                                animationIndex={selectedAnimation}
                                playing={isPlaying}
                                animationSpeed={animationSpeed}
                                envIntensity={envIntensity}
                                lightColor={lightColor}
                                backgroundColor={backgroundColor}
                                useUDIMShader={useUDIMShader}  // <-- pasamos la prop
                            />
                        </TextureDebugger>
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
