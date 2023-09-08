import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { useCursor, MeshPortalMaterial, CameraControls, Gltf, Text, Stats, Grid, TorusKnot } from '@react-three/drei'
import { useRoute, useLocation } from 'wouter'
import { easing, geometry } from 'maath'
import { suspend } from 'suspend-react'
import { Diamond } from './components/diamond'
import { Perf } from 'r3f-perf'
import { SpinningHead } from './components/spinningHead'

extend(geometry)
// const regular = import('@pmndrs/assets/fonts/inter_regular.woff')
// const medium = import('@pmndrs/assets/fonts/inter_medium.woff')



export const App = () => (
  <Canvas camera={{ fov: 75, position: [0, 0, 20] }} eventSource={document.getElementById('root')} eventPrefix="client">
    <color attach="background" args={['#f0f0f0']} />
    <Frame id="01" name={`pick\nles`} author="Omar Faruq Tawsif" bg="#e4cdac" position={[0, 0, 2]} rotation={[0, 0, 0]}>
      {/* <Gltf src="pickles_3d_version_of_hyuna_lees_illustration-transformed.glb" scale={8} position={[0, -0.7, -2]} /> */}
      <Diamond position={[0,0,-2]} scale={[.5,.5,.5]}/>
    </Frame>
    <Frame id="02" name="tea" author="Omar Faruq Tawsif" position={[2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
      {/* <Gltf src="fiesta_tea-transformed.glb" position={[0, -2, -3]} /> */}
      <TorusKnot position={[0,0,-2]} />
    </Frame>
    <Frame id="03" name="still" author="Omar Faruq Tawsif" bg="#d1d1ca" position={[0, 0, -2]} rotation={[0, Math.PI, 0]}>
      {/* <Gltf src="still_life_based_on_heathers_artwork-transformed.glb" scale={2} position={[0, -0.8, -4]} /> */}
    </Frame>
    <Frame id="04" name="still" author="Omar Faruq Tawsif" bg="#d1d1ca" position={[-2, 0, 0]} rotation={[0, (3 * Math.PI) / 2, 0]}>
      {/* <Gltf src="still_life_based_on_heathers_artwork-transformed.glb" scale={2} position={[0, -0.8, -4]} /> */}
    </Frame>
    <SpinningHead position={[0,2,0]} rotation={[-Math.PI / 2, 0, 0]}/>
    <Rig />
    {/* <Stats /> */}
    <Perf position="bottom-right" />
    <Grid infiniteGrid={true} position={[0,-1,0]}/>
  </Canvas>
)

function Frame({ id, name, author, bg, width = 1, height = 1.61803398875, children, ...props }) {
  const portal = useRef()
  const [, setLocation] = useLocation()
  const [, params] = useRoute('/item/:id')
  const [hovered, hover] = useState(false)
  useCursor(hovered)
  useFrame((state, dt) => easing.damp(portal.current, 'blend', params?.id === id ? 1 : 0, 0.2, dt))
  return (
    <group {...props}>
      {/* <Text font={suspend(medium).default} fontSize={0.3} anchorY="top" anchorX="left" lineHeight={0.8} position={[-0.375, 0.715, 0.01]} material-toneMapped={false}>
        {name}
      </Text>
      <Text font={suspend(regular).default} fontSize={0.1} anchorX="right" position={[0.4, -0.659, 0.01]} material-toneMapped={false}>
        /{id}
      </Text>
      <Text font={suspend(regular).default} fontSize={0.04} anchorX="right" position={[0.0, -0.677, 0.01]} material-toneMapped={false}>
        {author}
      </Text> */}
      <mesh name={id} onDoubleClick={(e) => (e.stopPropagation(), setLocation('/item/' + e.object.name))} onPointerOver={(e) => hover(true)} onPointerOut={() => hover(false)}>
        <roundedPlaneGeometry args={[width, height, 0.1]} />
        <MeshPortalMaterial ref={portal} events={params?.id === id}> {/* side={THREE.DoubleSide} */}
          <color attach="background" args={[bg]} />
          {children}
        </MeshPortalMaterial>
      </mesh>
    </group>
  )
}

function Rig({ position = new THREE.Vector3(0, 0, 5), focus = new THREE.Vector3(0, 0, 0) }) {
  const { controls, scene } = useThree()
  const [, params] = useRoute('/item/:id')
  useEffect(() => {
    const active = scene.getObjectByName(params?.id)
    if (active) {
      active.parent.localToWorld(position.set(0, 0.5, 0.25))
      active.parent.localToWorld(focus.set(0, 0, -2))
    } 
    controls?.setLookAt(...position.toArray(), ...focus.toArray(), true)
  })
  // useFrame((state, delta) => {
  //   easing.damp3(state.camera.position, [-1*(-1 + (state.pointer.x * state.viewport.width) / 20), ((1 + state.pointer.y) / 2) -.40, 1.5], 0.5, delta)
  //   state.camera.lookAt(0, 0, 0)
  // })
  return <CameraControls makeDefault maxPolarAngle={(13 * Math.PI) / 24} minPolarAngle={Math.PI / 4}/>
}