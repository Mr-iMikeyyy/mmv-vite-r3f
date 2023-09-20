import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import math from 'mathjs';

export default function Tesseract() {
  const tesseractRef = useRef();

  // Create a 4D tesseract
  const tesseractGeometry = new THREE.Geometry();

  // Generate 16 vertices for the tesseract
  const vertices = [];
  for (let i = 0; i < 16; i++) {
    const w = i % 2 === 0 ? 1 : -1; // Alternate w values to create the tesseract
    const x = (i & 1) === 0 ? 1 : -1;
    const y = (i & 2) === 0 ? 1 : -1;
    const z = (i & 4) === 0 ? 1 : -1;
    vertices.push([x, y, z, w]);
  }

  // Create the edges of the tesseract by connecting vertices
  for (let i = 0; i < 16; i++) {
    for (let j = i + 1; j < 16; j++) {
      const vertex1 = vertices[i];
      const vertex2 = vertices[j];
      if (math.sum(math.abs(math.subtract(vertex1, vertex2))) === 2) {
        tesseractGeometry.vertices.push(
          new THREE.Vector4(...vertex1),
          new THREE.Vector4(...vertex2)
        );
      }
    }
  }

  // Animation variables
  const speed = 0.01;
  let time = 0;

  // Use the useFrame hook to animate the tesseract
  useFrame(() => {
    time += speed;

    // Calculate the animation
    tesseractGeometry.vertices.forEach((vertex, index) => {
      const xOffset = Math.sin(time * (index + 1)) * 2; // Adjust the factor for the loop
      vertex.x = vertices[index][0] + xOffset;
    });

    tesseractGeometry.verticesNeedUpdate = true;

    tesseractRef.current.rotation.x += 0.005;
    tesseractRef.current.rotation.y += 0.005;
  });

  return (
    <lineSegments ref={tesseractRef}>
      <bufferGeometry attach="geometry" {...tesseractGeometry} />
      <lineBasicMaterial attach="material" color="blue" linewidth={2} />
    </lineSegments>
  );
};