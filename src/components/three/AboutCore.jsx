import React, { useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sparkles } from '@react-three/drei';
import { useRunState } from './useRunState';

/** Slowly counter-rotating tech chips (flat circles) floating around the core */
function OrbitingChips() {
  const group = React.useRef();
  const chips = useMemo(
    () => [
      { color: '#00ffdc', label: 'RAG' },
      { color: '#4079ff', label: 'AI' },
      { color: '#40ffaa', label: 'ML' },
    ],
    []
  );
  const radius = 2.6;

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.18;
  });

  return (
    <group ref={group}>
      {chips.map((chip, i) => {
        const angle = (i / chips.length) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <mesh key={chip.label} position={[x, 0.3 * Math.sin(i * 2.1), z]}>
            <cylinderGeometry args={[0.32, 0.32, 0.06, 24]} />
            <meshStandardMaterial color={chip.color} emissive={chip.color} emissiveIntensity={0.6} metalness={0.8} roughness={0.2} />
          </mesh>
        );
      })}
    </group>
  );
}

function CoreContent() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1.6} color="#40ffdc" />
      <pointLight position={[-4, -4, -3]} intensity={0.8} color="#4079ff" />

      <Float speed={1.2} rotationIntensity={0.6} floatIntensity={1.4}>
        {/* Distorted AI core */}
        <mesh>
          <sphereGeometry args={[1.35, 64, 64]} />
          <MeshDistortMaterial color="#0f3a4a" distort={0.35} speed={1.6} metalness={0.7} roughness={0.2} />
        </mesh>
        {/* Wireframe shell */}
        <mesh>
          <sphereGeometry args={[1.4, 24, 24]} />
          <meshBasicMaterial color="#00ffdc" wireframe transparent opacity={0.25} />
        </mesh>
        {/* Inner light */}
        <mesh>
          <sphereGeometry args={[0.5, 24, 24]} />
          <meshStandardMaterial color="#40ffdc" emissive="#40ffdc" emissiveIntensity={0.8} metalness={1} roughness={0.1} />
        </mesh>
      </Float>

      {/* Orbiting tech chips */}
      <OrbitingChips />

      <Sparkles count={90} scale={[8, 8, 8]} size={2.5} speed={0.3} color="#4079ff" />
      <Sparkles count={30} scale={[5, 5, 5]} size={3} speed={0.5} color="#00ffdc" />
    </>
  );
}

export default function AboutCore() {
  const { ref, run } = useRunState();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div ref={ref} className="h-full w-full">
      {ready && (
        <Canvas
          dpr={[1, 1.5]}
          frameloop={run ? 'always' : 'never'}
          camera={{ position: [0, 0, 5.2], fov: 50 }}
          gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
        >
          <CoreContent />
        </Canvas>
      )}
    </div>
  );
}
