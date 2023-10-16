import React, { useEffect, useRef, useMemo } from "react";
import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler";

import { extend, useFrame, useThree, useLoader } from "@react-three/fiber";
import textureMap from "./grass_blade.jpeg";
import { Circle, useGLTF } from "@react-three/drei";

extend({ OrbitControls, MeshSurfaceSampler });

let simpleNoise = `
float N (vec2 st) { // https://thebookofshaders.com/10/
		return fract( sin( dot( st.xy, vec2(12.9898,78.233 ) ) ) *  43758.5453123);
}

float smoothNoise( vec2 ip ){ // https://www.youtube.com/watch?v=zXsWftRdsvU
	vec2 lv = fract( ip );
	vec2 id = floor( ip );
	
	lv = lv * lv * ( 3. - 2. * lv );
	
	float bl = N( id );
	float br = N( id + vec2( 1, 0 ));
	float b = mix( bl, br, lv.x );
	
	float tl = N( id + vec2( 0, 1 ));
	float tr = N( id + vec2( 1, 1 ));
	float t = mix( tl, tr, lv.x );
	
	return mix( b, t, lv.y );
}
`;

const vertexShader = `
varying vec2 vUv;
uniform float time;

${simpleNoise}

void main() {

	vUv = uv;
	float t = time * 2.;
	
	// VERTEX POSITION
	
	vec4 mvPosition = vec4( position, 1.0 );
	#ifdef USE_INSTANCING
		mvPosition = instanceMatrix * mvPosition;
	#endif
	
	// DISPLACEMENT
	
	float noise = smoothNoise(mvPosition.xz * 0.5 + vec2(0., t));
	noise = pow(noise * 0.5 + 0.5, 2.) * 2.;
	
	// here the displacement is made stronger on the blades tips.
	float dispPower = 1. - cos( uv.y * 3.1416 * 0.10 );
	
	float displacement = noise * ( 0.3 * dispPower );
	mvPosition.z += displacement * noise;

	
	vec4 modelViewPosition = modelViewMatrix * mvPosition;
	gl_Position = projectionMatrix * modelViewPosition;

}
`;

const fragmentShader = `
varying vec2 vUv;
uniform sampler2D textureMap;

void main() {

	float alpha = texture2D(textureMap, vUv).r;
	//If transparent, don't draw
	if (alpha < 0.15) discard;
	
	vec3 baseColor = vec3( 0.9, 0.2, 0.2 );
	float clarity = ( vUv.y * 0.875 ) + 0.125;
	gl_FragColor = vec4( baseColor * clarity, 1 );
}
`;

const HomeTerrain = (props) => {
    const { nodes, materials } = useGLTF("/models/homeTerrainMeshLarge.glb");
    console.log(nodes);
  const {
    scene,
    camera,
    gl: { domElement }
  } = useThree();

  const terrainRef = useRef(null);

  const [texture] = useLoader(THREE.TextureLoader, [textureMap]);

  const uniforms = {
    time: {
      value: 0
    },
    textureMap: {
      value: texture
    }
  };

  const grassMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        side: THREE.DoubleSide
      }),
    []
  );

  const options = { bladeWidth: 0.005, bladeHeight: 0.09, joints: 5 };

  const baseGeom = useMemo(
    () =>
      new THREE.PlaneGeometry(
        options.bladeWidth,
        options.bladeHeight,
        1,
        options.joints
      ).translate(0, options.bladeHeight / 2, 0),
    [options]
  );

  useEffect(() => {
    const instanceNumber = 60000;
    const dummy = new THREE.Object3D();
    var geometry = baseGeom;

    const instancedMesh = new THREE.InstancedMesh(
      geometry,
      grassMaterial,
      instanceNumber
    );

    instancedMesh.scale.x = 5;
    instancedMesh.scale.y = 5;
    instancedMesh.scale.z = 5;

    instancedMesh.castShadow = true;

    if (terrainRef?.current) {
      const sampler = new MeshSurfaceSampler(terrainRef?.current).build();
      for (let i = 0; i < instanceNumber; i++) {
        const tempPosition = new THREE.Vector3();
        sampler.sample(tempPosition);

        dummy.position.set(tempPosition.x, tempPosition.y - .25, tempPosition.z);

        dummy.updateMatrix();
        if (tempPosition.y >= -2) {
          instancedMesh.setMatrixAt(i, dummy.matrix);
        }
      }
    }

    scene.add(instancedMesh);
  }, [scene, grassMaterial]);

  useFrame(({ clock }) => {
    grassMaterial.uniforms.time.value = clock.getElapsedTime();
    grassMaterial.uniformsNeedUpdate = true;
    grassMaterial.uniforms.textureMap.value = texture;
  });
  return (
    <>
      
      <group dispose={null}>
        <mesh
          ref={terrainRef}
          geometry={nodes.Disc.geometry}
          position={[0, 0, 0]}
          scale={2}
          visible={false}
        >
        </mesh>
      </group>
    </>
  );
};

useGLTF.preload("/models/homeTerrainMeshSmall.glb")

export default HomeTerrain;
