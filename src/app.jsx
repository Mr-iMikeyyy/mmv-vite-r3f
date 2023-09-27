import * as THREE from 'three'
import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, extend, useFrame, useLoader, useThree } from '@react-three/fiber'
import { useCursor, MeshPortalMaterial, CameraControls, Gltf, Text, Stats, Grid, TorusKnot, Environment, Circle, useTexture, Loader, MeshReflectorMaterial, Sphere, MeshDistortMaterial } from '@react-three/drei'
import { useRoute, useLocation } from 'wouter'
import { easing, geometry } from 'maath'
import { suspend } from 'suspend-react'
import { Diamond } from './components/diamond'
import { Perf } from 'r3f-perf'
import { SpinningHead } from './components/spinningHead'
import { DoorFrame } from './components/doorFrame'
import { RGBELoader } from 'three-stdlib'
import { MySphere } from './components/mySphere'
import { PinkTree } from './components/pinkTree'
import { PinkTree4k } from './components/pinkTree4k'
import { FloatingPetals } from './components/floatingPetals'

extend(geometry)
// const regular = import('@pmndrs/assets/fonts/inter_regular.woff')
// const medium = import('@pmndrs/assets/fonts/inter_medium.woff')






export const App = () => (
  <>
    <Canvas camera={{ fov: 75, position: [0, 0, 20] }} eventSource={document.getElementById('root')} eventPrefix="client" shadows={"soft"}>
      <Suspense fallback={null} >

        <Environment files={"/hdrs/kloofendal_43d_clear_puresky_1k.hdr"} background />
        <FloatingPetals count={50} />
        


        <Circle position={[0,-1,0]} rotation={[-Math.PI / 2, 0,0]} scale={100} receiveShadow>
          <meshBasicMaterial ></meshBasicMaterial>
          <MeshReflectorMaterial 
            blur={[300, 100]}
            mixStrength={10}
            resolution={512}
            mixBlur={1}
            roughness={1}
            depthScale={1.2}
            minDepthThreshold={.2}
            maxDepthThreshold={1.4}
            color="#506065"
            metalness={0.5}
          />
        </Circle>

        {/* <MySphere args={[2, 100, 100]} position={[6,2,0]} /> */}

        {/* <SpinningHead position={[0,2,0]} rotation={[-Math.PI / 2, 0, 0]} scale={[2,2,2]}/> */}
        <PinkTree4k position={[0,-1,0]} />
        <DoorFrame position={[0,-1,2]} scale={.02}/>
        <Portal id="01" name={`pick\nles`} author="Omar Faruq Tawsif" bg="#e4cdac" position={[0, -.1, 2]} rotation={[0, 0, 0]}>
          
          <Diamond position={[0,0,-2]} scale={[.5,.5,.5]} />
          <Environment files={"/hdrs/kloofendal_48d_partly_cloudy_puresky_1k.hdr"} background/>
        </Portal>

        <DoorFrame position={[2,-1,0]} scale={.02} rotation={[0, Math.PI / 2, 0]}/>
        <Portal id="02" name="tea" author="Omar Faruq Tawsif" position={[2, -.1, 0]} rotation={[0, Math.PI / 2, 0]}>
          
          <TorusKnot position={[0,0,-2]}>
            <meshStandardMaterial />
          </TorusKnot>
          <Environment files={"/hdrs/rooftop_night_1k.hdr"} background/>
        </Portal>

        <DoorFrame position={[0,-1,-2]} scale={.02}/>
        <Portal id="03" name="still" author="Omar Faruq Tawsif" bg="#d1d1ca" position={[0, -.1, -2]} rotation={[0, Math.PI, 0]}>
        
        </Portal>

        <DoorFrame position={[-2,-1,0]} scale={.02} rotation={[0, (3 * Math.PI) / 2, 0]}/>
        <Portal id="04" name="still" author="Omar Faruq Tawsif" bg="#d1d1ca" position={[-2,-.1, 0]} rotation={[0, (3 * Math.PI) / 2, 0]}>
          {/* <Gltf src="still_life_based_on_heathers_artwork-transformed.glb" scale={2} position={[0, -0.8, -4]} /> */}
        </Portal>

        
        {/* <Grid infiniteGrid={true} position={[0,0,0]}/> */}
        <Rig />
        <Perf position="bottom-right" />
      </Suspense >
    </Canvas>
    <Loader />
  </>
)

function Portal({ id, name, author, bg, width = 1, height = 1.8, children, ...props }) {
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
        <roundedPlaneGeometry args={[width, height, 0]} />
        <MeshPortalMaterial ref={portal} events={params?.id === id}>
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
  // useEffect(() => {
  //   console.log(controls._camera.rotation._y)
  // })
  // useFrame((state) => console.log(state.camera.rotation))
  // useFrame((state, delta) => {
  //   easing.damp3(state.camera.position, [-1*(-1 + (state.pointer.x * state.viewport.width) / 20), ((1 + state.pointer.y) / 2) -.40, 1.5], 0.5, delta)
  //   state.camera.lookAt(0, 0, 0)
  // })
  return <CameraControls makeDefault maxPolarAngle={(13 * Math.PI) / 24} minPolarAngle={Math.PI / 4} O/>
}