import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function Butterfly1(props) {
  const { nodes, materials } = useGLTF("/models/butterfly.glb");
  return (
    <group {...props} dispose={null}>
      <group
        // position={[-2.104, 423.44, 321.831]}
        rotation={[2.679, -0.163, 1.49]}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_2.geometry}
          material={materials["Scene_-_Root"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_3.geometry}
          material={materials["Scene_-_Root"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_4.geometry}
          material={materials["Scene_-_Root"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_5.geometry}
          material={materials["Scene_-_Root"]}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/models/butterfly.glb");