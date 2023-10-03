import React, { Suspense, useRef, useState, useLayoutEffect, useEffect, useMemo } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { OrthographicCamera, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";


export function PetalSwarm({ count, dummy = new THREE.Object3D() }) {
    const mesh = useRef()

    const color = useLoader(THREE.TextureLoader, "/textures/bark-21.jpg")

    const particles = useMemo(() => {
        const temp = []
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100
            const factor = 20 + Math.random() * 100
            const speed = 0.01 + Math.random() / 200
            const xFactor = -50 + Math.random() * 100
            const yFactor = -50 + Math.random() * 100
            const zFactor = -50 + Math.random() * 100
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
            particle.mx += (state.mouse.x * 1000 - particle.mx) * 0.01
            particle.my += (state.mouse.y * 1000 - 1 - particle.my) * 0.01
            dummy.position.set(
                (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
                (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
                (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
            )
            dummy.scale.setScalar(s)
            dummy.rotation.set(s * 5, s * 5, s * 5)
            dummy.updateMatrix()
            mesh.current.setMatrixAt(i, dummy.matrix)
        })
        mesh.current.instanceMatrix.needsUpdate = true
    })
    return (
        <>
            <instancedMesh ref={mesh} args={[null, null, count]}>
                <planeGeometry args={[10,10]} />
                <meshStandardMaterial map={color} />
            </instancedMesh>
        </>
    )
}