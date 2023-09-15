import * as THREE from "three"
import React, { useEffect, useRef } from "react";
import { useLoader, useFrame, useThree } from "@react-three/fiber";
import { MeshRefractionMaterial, useGLTF } from "@react-three/drei";
import { RGBELoader } from "three-stdlib";
import { suspend } from "suspend-react";


export function SpinningHead(props) {

  const { nodes } = useGLTF("/models/head.glb");

  const texture = useLoader(RGBELoader, "/hdrs/kloofendal_43d_clear_puresky_1k.hdr")

  const ref = useRef()

  useFrame((state, dt) => {
    ref.current.rotation.z += .2 * dt
  })

  return (
    <group {...props} dispose={null}>
      <mesh
        ref={ref}
        castShadow
        receiveShadow
        geometry={nodes.INGAME_BASE.geometry} 
      >
        <MeshRefractionMaterial envMap={texture} bounces={2} aberrationStrength={.5} ior={2.4} fresnel={1} color={'white'} fastChroma={true} side={THREE.DoubleSide}/>
      </mesh>
    </group>
  );
}

useGLTF.preload("/models/head.glb");