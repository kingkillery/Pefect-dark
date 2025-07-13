import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

/**
 * A shared GLTFLoader instance to avoid repeatedly allocating loaders.
 */
const gltfLoader = new GLTFLoader();

/**
 * In-memory cache so every distinct asset is parsed only once.
 * Subsequent calls return a cloned scene graph so callers can modify
 * materials / transforms without affecting the cached original.
 */
const modelCache: Map<string, THREE.Group> = new Map();

/**
 * Load a GLB/GLTF model from the given URL.
 * The returned object is a clone – safe for the caller to mutate.
 */
export async function loadModel(url: string): Promise<THREE.Group> {
  if (modelCache.has(url)) {
    return modelCache.get(url)!.clone();
  }

  const { scene } = await gltfLoader.loadAsync(url);
  modelCache.set(url, scene);
  return scene.clone();
}

/**
 * Convenience helper to add an HDR equirectangular environment map and set it
 * as the scene.environment (used by MeshStandardMaterial for IBL lighting).
 */
export function applyEnvironmentMap(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  hdrUrl: string,
) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();

  new RGBELoader().load(hdrUrl, (texture) => {
    const envMap = pmrem.fromEquirectangular(texture).texture;
    texture.dispose();
    pmrem.dispose();
    scene.environment = envMap;
  });
}
