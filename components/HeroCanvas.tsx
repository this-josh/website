'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
// Import for side effects to register the custom material tag via extend()
import './DepthDisplaceMaterial';

function HeroPlane(){
  const mesh = useRef<THREE.Mesh>(null!);
  const [base, setBase] = useState<THREE.Texture|null>(null);
  const [depth, setDepth] = useState<THREE.Texture|null>(null);
  const { size, camera } = useThree();

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load('/hero.jpg', (t) => { t.colorSpace = THREE.SRGBColorSpace; setBase(t); });
    // Depth map is grayscale; colorSpace not critical here
    loader.load('/hero-depth.png', (t) => { setDepth(t); }, undefined, () => setDepth(null));
  }, []);

  const matRef = useRef<any>(null);
  const mouse = useRef(new THREE.Vector2(0,0));

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.set((e.clientX/size.width)*2-1, (e.clientY/size.height)*-2+1);
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [size]);

  useFrame(() => {
    const mat: any = matRef.current;
    if(!mat) return;
    mat.uniforms.tMap.value = base;
    if(depth) mat.uniforms.tDepth.value = depth;
    mat.uniforms.uMouse.value.lerp(mouse.current, 0.08); // eased
    mat.uniforms.uStrength.value = depth ? 0.6 : 0;      // slightly reduced strength
  });

  // Fit image with CSS-like `background-size: contain` using perspective frustum
  const aspect = size.width / size.height;
  const distance = (camera as THREE.PerspectiveCamera).position.z;
  const vHeight = 2 * distance * Math.tan(((camera as THREE.PerspectiveCamera).fov * Math.PI/180) / 2);
  const vWidth = vHeight * aspect;
  let w = vWidth;
  let h = vHeight;
  if (base?.image?.width && base?.image?.height) {
    const imgAspect = base.image.width / base.image.height;
    // start by fitting width
    let cw = vWidth;
    let ch = cw / imgAspect;
    // if too tall, fit height instead
    if (ch > vHeight) {
      ch = vHeight;
      cw = ch * imgAspect;
    }
    // Slightly zoom to eliminate any letterboxing (true cover with tiny margin)
    const fill = Math.max(vWidth / cw, vHeight / ch);
    const overscan = fill * 1.02; // +2% for safety
    w = cw * overscan; h = ch * overscan;
  }

  return (
    base ? (
      <mesh ref={mesh}>
        <planeGeometry args={[w, h, 1, 1]} />
        {/* @ts-ignore */}
        <depthDisplaceMaterial ref={matRef} />
      </mesh>
    ) : null
  );
}

export default function HeroCanvas({ src = '/hero.jpg', depthSrc = '/hero-depth.png' }: { src?: string; depthSrc?: string }){
  return (
    <div className="relative h-screen w-full">
      {/* Blurred cover background to fill any letterboxing from contain-fit */}
      <div className="absolute inset-0 -z-10 blur-2xl opacity-60" style={{ backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <Canvas camera={{ position: [0,0,1], fov: 50 }}>
        <HeroPlaneWrapper src={src} depthSrc={depthSrc} />
      </Canvas>
    </div>
  );
}

function HeroPlaneWrapper({ src, depthSrc }: { src: string; depthSrc?: string }){
  return <HeroPlaneLoader src={src} depthSrc={depthSrc} />;
}

function HeroPlaneLoader({ src, depthSrc }: { src: string; depthSrc?: string }){
  const mesh = useRef<THREE.Mesh>(null!);
  const [base, setBase] = useState<THREE.Texture|null>(null);
  const [depth, setDepth] = useState<THREE.Texture|null>(null);
  const { size, camera } = useThree();

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(src, (t) => { t.colorSpace = THREE.SRGBColorSpace; setBase(t); });
    if (depthSrc) loader.load(depthSrc, (t) => { setDepth(t); }, undefined, () => setDepth(null));
  }, [src, depthSrc]);

  const matRef = useRef<any>(null);
  const mouse = useRef(new THREE.Vector2(0,0));

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.set((e.clientX/size.width)*2-1, (e.clientY/size.height)*-2+1);
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [size]);

  useFrame(() => {
    const mat: any = matRef.current;
    if(!mat) return;
    mat.uniforms.tMap.value = base;
    if(depth) mat.uniforms.tDepth.value = depth;
    mat.uniforms.uMouse.value.lerp(mouse.current, 0.08);
    mat.uniforms.uStrength.value = depth ? 0.6 : 0;
  });

  // Fit plane to show as much of the image as possible (contain) in current frustum
  const aspect = size.width / size.height;
  const distance = (camera as THREE.PerspectiveCamera).position.z;
  const vHeight = 2 * distance * Math.tan(((camera as THREE.PerspectiveCamera).fov * Math.PI/180) / 2);
  const vWidth = vHeight * aspect;
  let w = vWidth;
  let h = vHeight;
  if (base?.image?.width && base?.image?.height) {
    const imgAspect = base.image.width / base.image.height;
    let cw = vWidth;
    let ch = cw / imgAspect;
    if (ch > vHeight) {
      ch = vHeight;
      cw = ch * imgAspect;
    }
    const fill = Math.max(vWidth / cw, vHeight / ch);
    const overscan = fill * 1.02; // +2% for safety
    w = cw * overscan; h = ch * overscan;
  }

  return base ? (
    <mesh ref={mesh}>
      <planeGeometry args={[w, h, 1, 1]} />
      {/* @ts-ignore */}
      <depthDisplaceMaterial ref={matRef} />
    </mesh>
  ) : null;
}
