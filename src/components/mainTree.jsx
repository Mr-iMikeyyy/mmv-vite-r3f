import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function MainTree(props) {
  const { nodes, materials } = useGLTF("/models/mainTree.glb");
  materials["bark-21-252072635"].metalness = 0
  materials["leaf-26-fall-1"].metalness = 0
  materials["bark-21-252072635"].normalMap = null
  materials["leaf-26-fall-1"].normalMap = null
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["43-OldOak-L"].geometry}
        material={materials["bark-21-252072635"]}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Branches.geometry}
          material={materials["bark-21-252072635"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Leaves.geometry}
          material={materials["leaf-26-fall-1"]}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload("/models/mainTree.glb");
