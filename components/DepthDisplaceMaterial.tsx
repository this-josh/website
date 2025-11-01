import * as THREE from 'three';
// Deep import to avoid pulling in optional web deps from the root entry
import { shaderMaterial } from '@react-three/drei/core/shaderMaterial';
import { extend } from '@react-three/fiber';

const vertex = /* glsl */`
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }
`;

const fragment = /* glsl */`
  uniform sampler2D tMap;       // base image
  uniform sampler2D tDepth;     // optional depth map (0..1)
  uniform vec2 uMouse;          // -1..1
  uniform float uStrength;      // displacement intensity
  varying vec2 vUv;

  void main(){
    vec2 uv = vUv;
    if(uStrength > 0.0){
      float d = texture2D(tDepth, uv).r;                // 0 near, 1 far (adjust if inverted)
      vec2 par = uMouse * (d - 0.5) * uStrength * 0.04; // subtle parallax
      uv += par;
      uv = clamp(uv, 0.0, 1.0);
    }
    vec4 col = texture2D(tMap, uv);
    gl_FragColor = col;
  }
`;

export const DepthDisplaceMaterial = shaderMaterial(
  { tMap: null as any, tDepth: null as any, uMouse: new THREE.Vector2(), uStrength: 1 },
  vertex,
  fragment
);

extend({ DepthDisplaceMaterial });
