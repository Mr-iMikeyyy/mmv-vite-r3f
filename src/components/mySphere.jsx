import React, { useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { EnvironmentCube, MeshRefractionMaterial, Sphere, useGLTF } from "@react-three/drei";
import { useControls } from "leva";
import { RGBELoader } from "three-stdlib"

export function MySphere(props) {
    const ref = useRef()
    const texture = useLoader(RGBELoader, '/hdrs/kloofendal_43d_clear_puresky_1k.hdr')

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
        abberationStrength: 200,
        ior:1.5,
        fresnel:2,
        color:'white',
        fastChroma:false
    }

    return (
        <Sphere {...props} ref={ref}>
            <MeshRefractionMaterial envMap={texture} {...config} toneMapped={false} />
        </Sphere>
    );
}

