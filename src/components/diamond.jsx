import React, { useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { EnvironmentCube, MeshRefractionMaterial, useGLTF } from "@react-three/drei";
import { useControls } from "leva";
import { RGBELoader } from "three-stdlib"

export function Diamond(props) {
    const { nodes, materials } = useGLTF("/models/diamond.glb");
    const ref = useRef()
    const texture = useLoader(RGBELoader, 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr')

    // const config = useControls({
    //     bounces: { value: 4, min: 0, max: 8, step: 1 },
    //     aberrationStrength: { value: 0.01, min: 0, max: 0.1, step: 0.01 },
    //     ior: { value: 2.4, min: 0, max: 10 },
    //     fresnel: { value: 1, min: 0, max: 1 },
    //     color: 'white',
    //     fastChroma: true
    // })

    const config = {
        bounces: 4,
        abberationStrength: 0.01,
        ior:2.4,
        fresnel:1,
        color:'white',
        fastChroma:true
    }

  return (
    <group {...props} dispose={null}>
        <mesh
            castShadow
            receiveShadow
            geometry={nodes.Diamond_Cone.geometry}
            rotation={[Math.PI / 2, 0, 0]}
            ref={ref}
        >
            <MeshRefractionMaterial envMap={texture} {...config} toneMapped={false} />
        </mesh>
    </group>
  );
}

useGLTF.preload("/models/diamond.glb");