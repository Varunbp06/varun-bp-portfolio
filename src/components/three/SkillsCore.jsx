import React, { useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useRunState } from './useRunState';

/**
 * SkillsCore — a constellation of glowing nodes orbiting a wireframe torus
 * knot. Pure decoration (aria-hidden via SceneGate), lazy-loaded, desktop-only,
 * pauses offscreen. Colours match the site palette (#00ffdc / #4079ff).
 */

function useRandomSphere(count, rMin, rMax) {
  return useMemo(() => {
    const pts = [];
    for (let i = 0; i < count; i += 1) {
      const r = rMin + Math.random() * (rMax - rMin);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pts.push(new THREE.Vector3(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi)));
    }
    return pts;
  }, [count, rMin, rMax]);
}

function Constellation() {
  const group = React.useRef();
  const points = useRandomSphere(30, 2.1, 3.5);
  const colors = ['#00ffdc', '#4079ff', '#40ffaa', '#9adcff'];

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.14;
      group.current.rotation.x = Math.sin(Date.now() * 0.0002) * 0.12;
    }
  });

  return (
    <group ref={group}>
      {points.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.045 + (i % 3) * 0.02, 8, 8]} />
          <meshBasicMaterial color={colors[i % colors.length]} transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  );
}

function SkillsContent() {
  return (
    <>
      <ambientLight intensity={0.45} />
      <pointLight position={[4, 4, 4]} intensity={1.3} color="#40ffdc" />
      <pointLight position={[-4, -3, 2]} intensity={0.7} color="#4079ff" />

      <Float speed={1.2} rotationIntensity={0.5} floatIntensity={0.9}>
        {/* Wireframe torus knot — reads as a neural/knowledge graph glyph */}
        <mesh>
          <torusKnotGeometry args={[1.25, 0.34, 140, 16]} />
          <meshStandardMaterial color="#0e4a55" wireframe metalness={0.85} roughness={0.25} emissive="#0891b2" emissiveIntensity={0.25} />
        </mesh>
        {/* Inner nucleus */}
        <mesh>
          <sphereGeometry args={[0.42, 32, 32]} />
          <meshStandardMaterial color="#00ffdc" emissive="#00ffdc" emissiveIntensity={0.55} metalness={0.9} roughness={0.15} />
        </mesh>
      </Float>

      <Constellation />

      <Sparkles count={70} scale={[6.5, 6.5, 6.5]} size={2.2} speed={0.3} color="#00ffdc" />
      <Sparkles count={25} scale={[4.5, 4.5, 4.5]} size={3} speed={0.45} color="#4079ff" />
    </>
  );
}

export default function SkillsCore() {
  const { ref, run } = useRunState();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 420);
    return () => clearTimeout(t);
  }, []);

  return (
    <div ref={ref} className="h-full w-full">
      {ready && (
        <Canvas
          dpr={[1, 1.5]}
          frameloop={run ? 'always' : 'never'}
          camera={{ position: [0, 0, 6], fov: 50 }}
          gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
          style={{ pointerEvents: 'none' }}
        >
          <SkillsContent />
        </Canvas>
      )}
    </div>
  );
}
