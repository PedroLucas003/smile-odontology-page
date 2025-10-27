// src/components/Scene3D.tsx

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center, Text3D } from '@react-three/drei';

export default function Scene3D() {
  return (
    // AJUSTE 1: Posição da câmara e Campo de Visão (FOV)
    <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={2} />

      <Suspense fallback={null}>
        <Center>
          <Text3D
            font="/font.json"
            // AJUSTE 2: Tamanho do texto ligeiramente reduzido
            size={1.3}
            height={0.2}
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.02}
            bevelOffset={0}
            bevelSegments={5}
          >
            Sorria Odonto
            <meshStandardMaterial color="#518dfc" />
          </Text3D>
        </Center>
      </Suspense>

      <OrbitControls 
        enableZoom={false} // Mantemos o zoom desativado para não sair do enquadramento
        enablePan={false} // Desativamos o "pan" (arrastar) para manter o texto centrado
        autoRotate 
        autoRotateSpeed={0.6}
        // Limitamos a rotação vertical para uma melhor visualização
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 2.5}
      />
    </Canvas>
  );
}