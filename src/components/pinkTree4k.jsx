import React, { useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

export function PinkTree4k(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/models/pinkTree4k.glb");
  const { actions } = useAnimations(animations, group);
  return (
    <group ref={group} {...props} dispose={null} castShadow>
      <group name="Sketchfab_Scene">
        <group
          name="Sketchfab_model"
          rotation={[-Math.PI / 2, 0, 0]}
          scale={0.744}
        >
          <group name="Root">
            <group name="Bones">
              <primitive object={nodes.Bones_rootJoint} castShadow/>
              <skinnedMesh
                name="Leaves_0"
                geometry={nodes.Leaves_0.geometry}
                material={materials.Leaves}
                skeleton={nodes.Leaves_0.skeleton}
                castShadow
                receiveShadow
              />
              <skinnedMesh
                name="Trunk_0"
                geometry={nodes.Trunk_0.geometry}
                material={materials.Trunk}
                skeleton={nodes.Trunk_0.skeleton}
                castShadow
                receiveShadow
              />
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/pinkTree4k.glb");