import React, { Suspense, useRef, useState, useLayoutEffect, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

useGLTF.preload("/models/cherry_blossom_petal.glb", true);

export function PetalSwarm(count) {
    const { nodes, materials } = useGLTF("/models/cherry_blossom_petal.glb", true);
    const geo = nodes.Object_4.geometry.clone()
    const ref = useRef()

    const petalStartPos = Array.from({length: count}, () => ({
        scale: Math.random() + .5,
        position: [50 * Math.random() - 25, 10 * Math.random() - 1, 50 * Math.random() - 25]
    }))

    useEffect(() => {
        const transform = new THREE.Vector3();
        for (let i = 0; i < count; i++) {
            transform.setPosition(...petalStartPos[count].position)
            ref.current.setPosition(transform)
            ref.cu
        }
    }, [count])

    return (
        <instancedMesh ref={ref} args={[geo, materials.Object_4, count]} />
    )
}