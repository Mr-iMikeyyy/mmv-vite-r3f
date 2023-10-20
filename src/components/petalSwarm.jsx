import React, { Suspense, useRef, useState, useLayoutEffect, useEffect, useMemo } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import * as THREE from "three";


export function PetalSwarm({ count, dummy = new THREE.Object3D() }) {
    const mesh = useRef()

    const color = useLoader(THREE.TextureLoader, "/textures/petal/petal_color.jpg")
    const mask = useLoader(THREE.TextureLoader, "/textures/petal/petal_alpha.jpg")

    const particles = useMemo(() => {
        const temp = []
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100
            const factor = 20 + Math.random() * 100
            const speed = 0.007 + Math.random() / 20000000
            const xFactor = 1
            const yFactor = 10
            const zFactor = 1
            temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 })
        }
        return temp
    }, [count])

    useFrame((state) => {
        particles.forEach((particle, i) => {
            let { t, factor, speed, xFactor, yFactor, zFactor } = particle
            t = particle.t += speed / 2
            const a = Math.cos(t) + Math.sin(t * 1) / 10
            const b = Math.sin(t) + Math.cos(t * 2) / 10
            const s = Math.cos(t)
            particle.mx += (state.mouse.x * 100 - particle.mx) * 0.01
            particle.my += (state.mouse.y * 100 - 1 - particle.my) * 0.01
            dummy.position.set(
                (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
                (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.sin(t * 2) * factor) / 10,
                (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
            )
            dummy.scale.setScalar(.1)
            dummy.rotation.set(s * 20, s * 20 - 180, s * 20)
            dummy.updateMatrix()
            mesh.current.setMatrixAt(i, dummy.matrix)
        })
        mesh.current.instanceMatrix.needsUpdate = true
    })
    return (
        <>
            <group position={[0,-2,0]}>
                <instancedMesh ref={mesh} args={[null, null, count]}>
                    <planeGeometry args={[1,1]} />
                    <meshStandardMaterial map={color} alphaMap={mask} side={THREE.DoubleSide} transparent />
                </instancedMesh>
            </group>
        </>
    )
}