import * as THREE from "three"
import React, { useRef } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { MeshRefractionMaterial, useGLTF } from "@react-three/drei";
import { RGBELoader } from "three-stdlib";

export function SpinningHead(props) {

  const { nodes, materials } = useGLTF("/models/head.glb");

  const texture = useLoader(RGBELoader, 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr')

  const ref = useRef()

  useFrame((state, dt) => {
    ref.current.rotation.z += 1 * dt
  })

  return (
    <group {...props} dispose={null}>
      <mesh
        ref={ref}
        castShadow
        receiveShadow
        geometry={nodes.INGAME_BASE.geometry}
        // material={materials.defaultMat}  
      >
        <MeshRefractionMaterial envMap={texture} bounces={4} abberationStrength={0.01} ior={2.4} fresnel={1} color={'white'} fastChroma={true} side={THREE.DoubleSide}/>
      </mesh>
    </group>
  );
}

useGLTF.preload("/models/head.glb");