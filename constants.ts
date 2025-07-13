
import { PlayerStats, Weapon, WeaponType } from './types';

export const KILLS_TO_WIN = 20;
export const BOT_COUNT = 6;

export const INITIAL_PLAYER_STATS: PlayerStats = {
  health: 100,
  shield: 50,
  ammo: 100,
  kills: 0,
  deaths: 0,
};

export const WEAPONS: { [key in WeaponType]: Weapon } = {
  [WeaponType.PISTOL]: {
    type: WeaponType.PISTOL,
    name: 'Pistol',
    ammo: Infinity,
    maxAmmo: Infinity,
    damage: 15,
    fireRate: 400,
    automatic: false,
  },
  [WeaponType.RIFLE]: {
    type: WeaponType.RIFLE,
    name: 'Rifle',
    ammo: 150,
    maxAmmo: 150,
    damage: 25,
    fireRate: 150,
    automatic: true,
  },
};

export const PLAYER_SPEED = 8.0;
export const PLAYER_SPRINT_MULTIPLIER = 1.8;
export const PLAYER_JUMP_FORCE = 8.0;
export const GRAVITY = 25.0;
export const PLAYER_HEIGHT = 1.8;
export const PLAYER_RADIUS = 0.4;

export const SHIELD_REGEN_RATE = 10; // points per second
export const SHIELD_REGEN_DELAY = 3000; // ms after last damage
