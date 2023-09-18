import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function Door(props) {
  const { nodes, materials } = useGLTF("/models/doorFrameV2.glb");
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.InteriorDoor.geometry}
        material={materials.InteriorDoor}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  );
}

useGLTF.preload("/models/doorFrameV2.glb");