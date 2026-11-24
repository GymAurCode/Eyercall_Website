import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Float,
  Lightformer,
  OrbitControls,
  Preload,
  useGLTF,
} from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "@/lib/theme";

const MODEL_URL = "/3dlogo.glb";
/** Longest edge of the model once framed, in world units. */
const MODEL_TARGET = 2.8;
/** Share of the viewport the framed model occupies. */
const FILL = 0.544;
const FOV = 38;

/**
 * Warm the loader cache as soon as this chunk is evaluated. The parsed scene is
 * kept alive by the loader cache, so navigating away and back reuses it
 * instead of downloading the GLB again.
 */
if (typeof window !== "undefined") {
  useGLTF.preload(MODEL_URL);
}

function LogoModel() {
  const { scene } = useGLTF(MODEL_URL);
  const camera = useThree((state) => state.camera);
  const controls = useThree((state) => state.controls) as { update: () => void } | null;

  const { scale, offset, distance } = useMemo(() => {
    const bounds = new THREE.Box3();
    // Widest silhouette the model can reach while spinning around the Y axis.
    let halfWidth = 0;
    let halfHeight = 0;
    scene.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (!mesh.isMesh) return;
      const meshBox = new THREE.Box3().setFromObject(mesh);
      if (meshBox.isEmpty()) return;
      bounds.union(meshBox);
      const spanX = Math.max(Math.abs(meshBox.min.x), Math.abs(meshBox.max.x));
      const spanY = Math.max(Math.abs(meshBox.min.y), Math.abs(meshBox.max.y));
      const spanZ = Math.max(Math.abs(meshBox.min.z), Math.abs(meshBox.max.z));
      halfWidth = Math.max(halfWidth, Math.hypot(spanX, spanZ));
      halfHeight = Math.max(halfHeight, spanY);
    });

    const extent = Math.max(halfWidth, halfHeight);
    const uniform = MODEL_TARGET / (2 * extent);
    const center = bounds.getCenter(new THREE.Vector3());
    return {
      scale: uniform,
      offset: center.clone().multiplyScalar(-uniform),
      distance: (extent * uniform) / (Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * FILL),
    };
  }, [scene]);

  useEffect(() => {
    camera.position.set(0, 0, distance);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    controls?.update();
  }, [camera, controls, distance]);

  return (
    <Float speed={1.2} rotationIntensity={0.14} floatIntensity={0.7}>
      <group position={offset} scale={scale} rotation={[-0.12, 0, 0]}>
        {/* dispose={null}: the scene is shared through the loader cache and must
            outlive this canvas, otherwise the next mount renders a dead model. */}
        <primitive object={scene} dispose={null} />
      </group>
    </Float>
  );
}

/**
 * Reports the moment the model is actually on screen, so the hero can reveal
 * it in a single fade instead of swapping an image for the canvas.
 */
function ReadySignal({ onReady }: { onReady?: (() => void) | undefined }) {
  const frames = useRef(0);
  const signaled = useRef(false);

  useFrame(() => {
    if (signaled.current) return;
    frames.current += 1;
    // The first frame draws the model, the second proves it reached the canvas.
    if (frames.current >= 1) {
      signaled.current = true;
      onReady?.();
    }
  });

  return null;
}

/**
 * three.js re-creates its GPU state when a context is restored, but the
 * transparent clear colour has to be re-applied and a frame has to be asked
 * for. Without preventDefault on the loss event the browser never restores.
 */
function ContextRecovery() {
  const gl = useThree((state) => state.gl);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    const canvas = gl.domElement;
    const handleLost = (event: Event) => {
      event.preventDefault();
    };
    const handleRestored = () => {
      gl.setClearColor(0x000000, 0);
      invalidate();
    };

    canvas.addEventListener("webglcontextlost", handleLost);
    canvas.addEventListener("webglcontextrestored", handleRestored);
    return () => {
      canvas.removeEventListener("webglcontextlost", handleLost);
      canvas.removeEventListener("webglcontextrestored", handleRestored);
    };
  }, [gl, invalidate]);

  return null;
}

function Studio() {
  const theme = useTheme();
  const dark = theme === "dark";
  return (
    <>
      <ambientLight intensity={dark ? 0.4 : 0.7} />
      <directionalLight position={[4, 6, 6]} intensity={dark ? 2.8 : 2.4} />
      <directionalLight
        position={[-6, -2, 4]}
        intensity={dark ? 2 : 1}
        color={dark ? "#2fb0b0" : "#7fd7e0"}
      />
      <spotLight
        position={[0, 7, 5]}
        angle={0.55}
        penumbra={1}
        intensity={dark ? 55 : 45}
        distance={30}
        color="#ffffff"
      />
      {/* The environment map is baked once per mount from neutral teal-white
          light, so it works on both themes and never has to be rebuilt when the
          theme changes - only the direct lights below are re-tuned. */}
      <Environment resolution={256} frames={1}>
        <Lightformer
          form="rect"
          intensity={4.5}
          color="#ffffff"
          position={[0, 5, -7]}
          scale={[12, 12, 1]}
        />
        <Lightformer
          form="rect"
          intensity={2.6}
          color="#2fb0b0"
          position={[-7, 1, 2]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[10, 10, 1]}
        />
        <Lightformer
          form="rect"
          intensity={2.2}
          color="#d8f0f0"
          position={[7, -2, 2]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={[10, 10, 1]}
        />
        <Lightformer
          form="circle"
          intensity={2.4}
          color="#ffffff"
          position={[0, 0, 6]}
          scale={[5, 5, 1]}
        />
      </Environment>
    </>
  );
}

function SceneControls() {
  const domElement = useThree((state) => state.gl.domElement);
  useEffect(() => {
    // Vertical swipes scroll the page, horizontal drags rotate the model.
    domElement.style.setProperty("touch-action", "pan-y", "important");
  }, [domElement]);
  return (
    <OrbitControls
      makeDefault
      domElement={domElement}
      enableZoom={false}
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.7}
      autoRotate
      autoRotateSpeed={1.5}
      minPolarAngle={0.7}
      maxPolarAngle={2.1}
    />
  );
}

export default function HeroCanvas({ onReady }: { onReady?: (() => void) | undefined }) {
  return (
    <Canvas
      className="h-full w-full"
      dpr={[1, 2]}
      camera={{ position: [0, 0, 7], fov: FOV, near: 0.1, far: 100 }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <Studio />
      <SceneControls />
      <ContextRecovery />
      <Suspense fallback={null}>
        <LogoModel />
        <ReadySignal onReady={onReady} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
}
