
import * as THREE from 'three';

export enum GameState {
  MENU,
  PLAYING,
  GAME_OVER,
}

export interface PlayerStats {
  health: number;
  shield: number;
  ammo: number;
  kills: number;
  deaths: number;
}

export enum WeaponType {
  PISTOL,
  RIFLE,
}

export interface Weapon {
  type: WeaponType;
  name: string;
  ammo: number;
  maxAmmo: number;
  damage: number;
  fireRate: number; // ms between shots
  automatic: boolean;
}

export interface Bot extends PlayerStats {
  id: number;
  mesh: THREE.Mesh<THREE.CapsuleGeometry, THREE.MeshStandardMaterial>;
  velocity: THREE.Vector3;
  targetPosition: THREE.Vector3;
  lastShotTime: number;
  isDead: boolean;
  respawnTime: number;
}
