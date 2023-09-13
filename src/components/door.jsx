import React, { useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

export function Door(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/models/door_wood.glb");
  const { actions } = useAnimations(animations, group);
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group
          name="Sketchfab_model"
          rotation={[-Math.PI / 2, 0, 0]}
          scale={0.014}
        >
          <group name="woodenDoor_01_v1_ANIMfbx" rotation={[Math.PI / 2, 0, 0]}>
            <group name="Object_2">
              <group name="RootNode">
                <group
                  name="DoorBone"
                  position={[-39.985, 99.502, 0.6]}
                  rotation={[-Math.PI / 2, 0, 0]}
                  scale={100}
                >
                  <group name="Object_5">
                    <primitive object={nodes._rootJoint} />
                    <group name="Door" position={[-0.018, -0.02, 0.055]}>
                      <mesh
                        name="Door_MAT_Door_0"
                        castShadow
                        receiveShadow
                        geometry={nodes.Door_MAT_Door_0.geometry}
                        material={materials.MAT_Door}
                      />
                      <group name="Handle_Back" position={[0.78, 0.008, 0]}>
                        <mesh
                          name="Handle_Back_MAT_Handle_0"
                          castShadow
                          receiveShadow
                          geometry={nodes.Handle_Back_MAT_Handle_0.geometry}
                          material={materials.MAT_Handle}
                        />
                      </group>
                      <group name="Handle_Front" position={[0.78, 0.021, 0]}>
                        <mesh
                          name="Handle_Front_MAT_Handle_0"
                          castShadow
                          receiveShadow
                          geometry={nodes.Handle_Front_MAT_Handle_0.geometry}
                          material={materials.MAT_Handle}
                        />
                      </group>
                    </group>
                  </group>
                </group>
                <group
                  name="DoorFrame"
                  rotation={[-Math.PI / 2, 0, 0]}
                  scale={100}
                >
                  <mesh
                    name="DoorFrame_MAT_Door_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.DoorFrame_MAT_Door_0.geometry}
                    material={materials.MAT_Door}
                  />
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/door_wood.glb");