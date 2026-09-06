import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Stars } from '@react-three/drei';
import { useRunState } from './useRunState';

/** Pointer-parallax rig — the whole system leans gently toward the cursor. */
function Rig({ children }) {
  const ref = useRef();
  useFrame((state, delta) => {
    if (!ref.current) return;
    const k = Math.min(1, delta * 2.2);
    ref.current.rotation.y += (state.pointer.x * 0.35 - ref.current.rotation.y) * k;
    ref.current.rotation.x += (-state.pointer.y * 0.25 - ref.current.rotation.x) * k;
  });
  return <group ref={ref}>{children}</group>;
}

/** Data-node satellites on inclined orbits — vector-store / agent / stream nodes. */
const SATELLITES = [
  { color: '#00ffdc', radius: 2.1, speed: 0.5, size: 0.09, tilt: 0.5 },
  { color: '#4079ff', radius: 2.5, speed: -0.35, size: 0.07, tilt: -0.4 },
  { color: '#40ffaa', radius: 2.9, speed: 0.28, size: 0.06, tilt: 0.9 },
  { color: '#9adcff', radius: 1.8, speed: -0.6, size: 0.05, tilt: 1.2 },
];

function Satellites() {
  const refs = useRef([]);
  useFrame((_, delta) => {
    refs.current.forEach((g, i) => {
      if (g) g.rotation.y += delta * SATELLITES[i].speed;
    });
  });
  return (
    <>
      {SATELLITES.map((s, i) => (
        <group key={s.color} rotation={[s.tilt, 0, 0]}>
          {/* faint orbit path */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[s.radius, 0.006, 8, 80]} />
            <meshBasicMaterial color={s.color} transparent opacity={0.25} />
          </mesh>
          <group ref={(el) => { refs.current[i] = el; }}>
            <mesh position={[s.radius, 0, 0]}>
              <sphereGeometry args={[s.size, 16, 16]} />
              <meshStandardMaterial color={s.color} emissive={s.color} emissiveIntensity={1.4} />
            </mesh>
            {/* halo */}
            <mesh position={[s.radius, 0, 0]}>
              <sphereGeometry args={[s.size * 1.9, 16, 16]} />
              <meshBasicMaterial color={s.color} transparent opacity={0.15} />
            </mesh>
          </group>
        </group>
      ))}
    </>
  );
}

function OrbitContent() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 4, 4]} intensity={1.4} color="#40ffdc" />
      <pointLight position={[-4, -3, 2]} intensity={0.8} color="#4079ff" />

      {/* Deep cosmos starfield behind the core */}
      <Stars radius={30} depth={18} count={1400} factor={3} saturation={0.7} fade speed={0.6} />

      <Rig>
        <Float speed={1.4} rotationIntensity={1.2} floatIntensity={1.2}>
          {/* Wireframe icosahedron */}
          <mesh>
            <icosahedronGeometry args={[1.45, 0]} />
            <meshStandardMaterial color="#0e3a4a" wireframe metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Inner glowing core */}
          <mesh>
            <sphereGeometry args={[0.55, 32, 32]} />
            <meshStandardMaterial color="#00ffdc" emissive="#00ffdc" emissiveIntensity={0.5} metalness={0.9} roughness={0.15} />
          </mesh>
        </Float>

        {/* Data-node satellites */}
        <Satellites />
      </Rig>

      {/* Orbiting rings */}
      <mesh rotation={[Math.PI / 2.4, 0.3, 0]}>
        <torusGeometry args={[2.3, 0.025, 12, 72]} />
        <meshStandardMaterial color="#4079ff" emissive="#4079ff" emissiveIntensity={0.9} />
      </mesh>
      <mesh rotation={[Math.PI / 1.9, -0.5, 0.4]}>
        <torusGeometry args={[2.7, 0.015, 12, 72]} />
        <meshStandardMaterial color="#00ffdc" emissive="#00ffdc" emissiveIntensity={0.6} transparent opacity={0.7} />
      </mesh>

      <Sparkles count={90} scale={[7, 7, 7]} size={2.2} speed={0.35} color="#00ffdc" />
    </>
  );
}

export default function HeroOrbit() {
  const { ref, run } = useRunState();
  const [ready, setReady] = useState(false);

  // Delay mount slightly so WebGL doesn't block first paint (anti-lag)
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 350);
    return () => clearTimeout(t);
  }, []);

  return (
    <div ref={ref} className="absolute inset-0">
      {ready && (
        <Canvas
          dpr={[1, 1.5]}
          frameloop={run ? 'always' : 'never'}
          camera={{ position: [0, 0, 6], fov: 50 }}
          gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
          style={{ pointerEvents: 'none' }}
        >
          <OrbitContent />
        </Canvas>
      )}
    </div>
  );
}
