import React, {useRef, useMemo, useState, useEffect} from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Box, Instance, Instances, useGLTF } from '@react-three/drei'

function Dummy({ id, object, ...props }) {
    const ref = useRef()
  
    useEffect(() => {
      if (!ref.current) return
  
      ref.current.position.copy(object.position)
      ref.current.scale.set(1, 1, 1)
    }, [object])

    useFrame((state, delta) => {
        if (ref.current.position.y < -1) {
            ref.current.position.copy(object.position)
        }
        else {
            ref.current.position.set(
                ref.current.position.x - object.speed * delta,
                ref.current.position.y - object.speed * delta,
                ref.current.position.z - object.speed * delta
            )
        }
    })
  
    return (
      <group {...props}>
        <Instance ref={ref} />
      </group>
    )
}

function Petal(props) {
    
    const ref = useRef()
    return (
        
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_4.geometry}
          material={materials.SakuraHanaBira}
          rotation={[Math.PI / 2, 0, 0]}
          ref={ref}
          // args={[nodes.Object_4.geometry,materials.SakuraHanaBira,props.count]}
        />
    );
}
  

function Petals({ count = 10, objects }) {
    return (
      <group>
        <Instances limit={count} castShadow receiveShadow>
            {/* <boxGeometry args={[]} castShadow={true} />
            <meshStandardMaterial color="red" /> */}
            <Petal />
            
            
            {objects.map((obj, i) => (
                <Dummy key={i} id={i} object={obj} />
            ))}
        </Instances>
      </group>
    )
}


export function FloatingPetals({ count, ...props }) {
    const objects = useMemo(() => Array.from({ length: count }).map(() => new THREE.Object3D()), [])
  
    const [trees, setTrees] = useState([])

    useEffect(() => {
        for (let i = 0; i < count; i++) {
            const tree = objects[i]
            tree.position.set(Math.random() * 20, 3, Math.random() * 20)
            tree.speed = 0.01 + Math.random() / 1
        }
        setTrees(objects)
    }, [])

    return (
        <group  position={[0, 0, 0]}>
            <Petals objects={trees} count={count} />
        </group>
    )
}