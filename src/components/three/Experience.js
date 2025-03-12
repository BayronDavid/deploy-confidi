'use client';

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
// import { useGLTF } from "@react-three/drei";
// import { gsap } from "gsap";
// import * as THREE from "three";
import Model from "./Model";

const Experience = ({ scrollProgress }) => {
  const group = useRef();
  const targetRotation = useRef({ x: 0, y: 0 });

  // Update rotation based on scroll progress
  useEffect(() => {
    // Full rotation based on scroll
    targetRotation.current.y = scrollProgress * Math.PI * 2;
    // Slight tilt based on scroll
    targetRotation.current.x = Math.sin(scrollProgress * Math.PI) * 0.3;
  }, [scrollProgress]);

  useFrame((state, delta) => {
    // Smooth rotation
    group.current.rotation.y +=
      (targetRotation.current.y - group.current.rotation.y) * 0.05;
    group.current.rotation.x +=
      (targetRotation.current.x - group.current.rotation.x) * 0.05;

    // Add some ambient movement
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });

  return (
    <group ref={group}>
      <Model scrollProgress={scrollProgress} />
    </group>
  );
};

export default Experience;
