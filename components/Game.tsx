import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { loadModel, applyEnvironmentMap } from '../models';
import { PlayerStats, Bot, WeaponType } from '../types';
import {
  KILLS_TO_WIN, BOT_COUNT, PLAYER_SPEED, PLAYER_SPRINT_MULTIPLIER, PLAYER_JUMP_FORCE, GRAVITY, PLAYER_HEIGHT, PLAYER_RADIUS, SHIELD_REGEN_DELAY, SHIELD_REGEN_RATE, WEAPONS
} from '../constants';

interface GameProps {
  setPlayerStats: React.Dispatch<React.SetStateAction<PlayerStats>>;
  onGameOver: (winner: string) => void;
}

const createGridTexture = (size: number, color: string, lineColor: string, lineWidth: number, cellSize: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    if (!context) return null;

    context.fillStyle = color;
    context.fillRect(0, 0, size, size);
    context.strokeStyle = lineColor;
    context.lineWidth = lineWidth;

    for (let i = 0; i < size; i += cellSize) {
        context.beginPath();
        context.moveTo(i, 0);
        context.lineTo(i, size);
        context.stroke();
        context.beginPath();
        context.moveTo(0, i);
        context.lineTo(size, i);
        context.stroke();
    }
    return new THREE.CanvasTexture(canvas);
};


const Game: React.FC<GameProps> = ({ setPlayerStats, onGameOver }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const gameStarted = useRef(false);

  useEffect(() => {
    if (!mountRef.current || gameStarted.current) return;
    gameStarted.current = true;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111122);
    scene.fog = new THREE.Fog(0x111122, 0, 150);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.y = PLAYER_HEIGHT;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Environment Map
    applyEnvironmentMap(renderer, scene, '/textures/env.hdr');

    // Ground
    const groundTexture = createGridTexture(1024, '#334', '#668', 2, 64);
    const groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Player setup
    const controls = new PointerLockControls(camera, renderer.domElement);
    const keys: { [key: string]: boolean } = {};
    let playerVelocity = new THREE.Vector3();
    let canJump = true;
    let isSprinting = false;
    let lastShieldRegenTime = 0;

    const localPlayerStats: PlayerStats = {
        health: 100,
        shield: 50,
        ammo: WEAPONS[WeaponType.RIFLE].maxAmmo,
        kills: 0,
        deaths: 0
    };

    const blocker = document.getElementById('blocker-container');
    const instructions = document.getElementById('instructions-container');

    const lockHandler = () => {
        if (blocker) blocker.style.display = 'none';
        controls.lock();
    };
    const unlockHandler = () => {
        if (blocker) blocker.style.display = 'flex';
    };

    renderer.domElement.addEventListener('click', lockHandler);
    controls.addEventListener('unlock', unlockHandler);

    const handleKeyDown = (e: KeyboardEvent) => { keys[e.code] = true; };
    document.addEventListener('keydown', handleKeyDown);
    const handleKeyUp = (e: KeyboardEvent) => { keys[e.code] = false; };
    document.addEventListener('keyup', handleKeyUp);

    // Obstacles
    const obstacles: THREE.Object3D[] = [];
    (async () => {
        const obstacleUrls = [
            '/models/SciFiEssentialsKit/Prop_Crate.gltf',
            '/models/SciFiEssentialsKit/Prop_Barrel1.gltf',
            '/models/SciFiEssentialsKit/Prop_Barrel2_Open.gltf'
        ];
        for (let i = 0; i < 10; i++) {
            const url = obstacleUrls[Math.floor(Math.random() * obstacleUrls.length)];
            try {
                const model = await loadModel(url);
                model.traverse(obj => {
                    if (obj instanceof THREE.Mesh) {
                        obj.castShadow = true;
                        obj.receiveShadow = true;
                    }
                });
                model.position.set(
                    (Math.random() - 0.5) * 180,
                    0,
                    (Math.random() - 0.5) * 180
                );
                model.rotation.y = Math.random() * Math.PI * 2;
                scene.add(model);
                obstacles.push(model);
            } catch (err) {
                console.error('Failed to load obstacle model', url, err);
            }
        }
    })();

    // Spawn Points
    const spawnPoints: THREE.Vector3[] = [];
    for (let i = 0; i < 20; i++) {
        spawnPoints.push(new THREE.Vector3(
            (Math.random() - 0.5) * 180,
            PLAYER_HEIGHT,
            (Math.random() - 0.5) * 180
        ));
    }

    // Bot Waypoints
    const botWaypoints: THREE.Vector3[] = [];
    for (let i = 0; i < 30; i++) {
        botWaypoints.push(new THREE.Vector3(
            (Math.random() - 0.5) * 190,
            PLAYER_HEIGHT,
            (Math.random() - 0.5) * 190
        ));
    }

    // Bots
    const bots: Bot[] = [];
    (async () => {
      for (let i = 0; i < BOT_COUNT; i++) {
          let botMesh: THREE.Object3D;
          try {
              const model = await loadModel('/models/SciFiEssentialsKit/Enemy_EyeDrone.gltf');
              let meshFromModel: THREE.Mesh | undefined;
              model.traverse(obj => {
                  if (obj instanceof THREE.Mesh) {
                      obj.castShadow = true;
                      obj.receiveShadow = true;
                      if (!meshFromModel) {
                        meshFromModel = obj;
                      }
                  }
              });

              if (meshFromModel) {
                botMesh = meshFromModel;
                botMesh.scale.set(2, 2, 2);
              } else {
                throw new Error("No mesh found in the loaded model.");
              }

          } catch (error) {
              console.error(`Failed to load model for bot ${i}, using fallback:`, error);
              const botGeometry = new THREE.CapsuleGeometry(PLAYER_RADIUS, PLAYER_HEIGHT - PLAYER_RADIUS * 2, 4, 8);
              const botMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
              botMesh = new THREE.Mesh(botGeometry, botMaterial);
          }

          const bot: Bot = {
              id: i,
              mesh: botMesh,
              velocity: new THREE.Vector3(),
              health: 100,
              shield: 0,
              ammo: 100,
              kills: 0,
              deaths: 0,
              targetPosition: botWaypoints[Math.floor(Math.random() * botWaypoints.length)].clone(),
              lastShotTime: 0,
              isDead: false,
              respawnTime: 0
          };
          bot.mesh.userData = { id: i, type: 'bot' };
          respawnBot(bot);
          bots.push(bot);
          scene.add(bot.mesh);
      }
    })();

    function respawnBot(bot: Bot) {
        bot.health = 100;
        bot.isDead = false;
        bot.mesh.visible = true;
        const spawnPoint = spawnPoints[Math.floor(Math.random() * spawnPoints.length)].clone();
        spawnPoint.y = PLAYER_HEIGHT;
        bot.mesh.position.copy(spawnPoint);
        bot.velocity.set(0,0,0);
    }

    function respawnPlayer() {
        localPlayerStats.health = 100;
        localPlayerStats.shield = 50;
        localPlayerStats.ammo = WEAPONS[WeaponType.RIFLE].maxAmmo;
        const spawnPoint = spawnPoints[Math.floor(Math.random() * spawnPoints.length)].clone();
        camera.position.copy(spawnPoint);
        playerVelocity.set(0,0,0);
    }

    const clock = new THREE.Clock();

    function animate() {
        if (!gameStarted.current) return;
        requestAnimationFrame(animate);

        const delta = clock.getDelta();

        // Player movement
        if (controls.isLocked) {
            const speed = isSprinting ? PLAYER_SPEED * PLAYER_SPRINT_MULTIPLIER : PLAYER_SPEED;
            const moveDirection = new THREE.Vector3();
            if (keys['KeyW']) moveDirection.z = -1;
            if (keys['KeyS']) moveDirection.z = 1;
            if (keys['KeyA']) moveDirection.x = -1;
            if (keys['KeyD']) moveDirection.x = 1;
            moveDirection.normalize().applyEuler(camera.rotation);

            playerVelocity.x = moveDirection.x * speed;
            playerVelocity.z = moveDirection.z * speed;

            if (keys['Space'] && canJump) {
                playerVelocity.y = PLAYER_JUMP_FORCE;
                canJump = false;
            }

            playerVelocity.y -= GRAVITY * delta;
            camera.position.add(playerVelocity.clone().multiplyScalar(delta));

            if (camera.position.y < PLAYER_HEIGHT) {
                camera.position.y = PLAYER_HEIGHT;
                playerVelocity.y = 0;
                canJump = true;
            }
        }

        // Shield regeneration
        if (Date.now() - lastShieldRegenTime > SHIELD_REGEN_DELAY && localPlayerStats.shield < 50) {
            localPlayerStats.shield = Math.min(50, localPlayerStats.shield + SHIELD_REGEN_RATE * delta);
        }

        setPlayerStats({ ...localPlayerStats });
        
        // Game Over Check
        if (localPlayerStats.kills >= KILLS_TO_WIN) {
            gameStarted.current = false;
            controls.unlock();
            onGameOver('Player');
        } else {
            const botWinner = bots.find(b => b.kills >= KILLS_TO_WIN);
            if (botWinner) {
                gameStarted.current = false;
                controls.unlock();
                onGameOver(`Bot ${botWinner.id + 1}`);
            }
        }

        renderer.render(scene, camera);
    }
    animate();

    return () => {
      gameStarted.current = false;
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.domElement.removeEventListener('click', lockHandler);
      controls.removeEventListener('unlock', unlockHandler);
      controls.dispose();
      renderer.dispose();
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [setPlayerStats, onGameOver]);

  return (
    <div className="w-full h-full cursor-crosshair">
        <div ref={mountRef} className="w-full h-full" />
        <div id="blocker-container" className="absolute inset-0 bg-black/50 flex justify-center items-center" style={{display: 'none'}}>
            <div id="instructions-container" className="text-center text-white">
                <h1 className="text-4xl font-bold">Click to resume</h1>
                <p className="text-xl mt-4">W, A, S, D to move</p>
                <p className="text-xl">Shift to sprint</p>
                <p className="text-xl">Space to jump</p>
                <p className="text-xl">Mouse to aim</p>
                <p className="text-xl">Click to shoot</p>
            </div>
        </div>
    </div>
    );
};

export default Game;
