'use client';

import { useRef } from "react";

const Model = () => {
  const mesh = useRef();


  return (
    <mesh ref={mesh} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial wireframe color={"#A4185C"} />
    </mesh>
  );
};

export default Model;
