# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
**Deathmatch Arena** - A browser-based first-person shooter game built with React 19, TypeScript, and Three.js. Players battle AI bots in a 3D arena environment with health/shield mechanics and multiple weapon types.

## Development Commands
- **Start development server:** `npm run dev`
- **Build for production:** `npm run build`
- **Preview production build:** `npm run preview`
- **Install dependencies:** `npm install`

Note: No linting, testing, or formatting commands are currently configured.

## Core Architecture

### State Management
The app uses a simple state machine with three states (MENU, PLAYING, GAME_OVER) managed through React hooks in `App.tsx`. All game state flows through React's useState/useCallback patterns - no external state management libraries.

### Component Hierarchy
```
App.tsx (game state + stats)
├── StartScreen.tsx (menu state)
├── Game.tsx (Three.js scene + game loop)
│   └── HUD.tsx (overlay UI)
└── GameOverScreen.tsx (results)
```

### Three.js Integration
`Game.tsx` handles all 3D rendering and game logic:
- Direct DOM manipulation with useRef for canvas mounting
- Game loop runs in useEffect with cleanup
- Physics simulation for player movement (WASD + mouse look)
- AI bot behavior and collision detection
- Model loading through cached asset system

### Asset Pipeline
Models are loaded via `models/index.ts` with caching system:
- GLTFLoader for .glb files from Kenney Sci-Fi RTS pack
- Model cloning for multiple instances
- HDR environment maps for PBR lighting

## Key Files & Patterns

### Type Definitions (`types.ts`)
Central type system defines:
- GameState enum for state machine
- PlayerStats interface (health, shield, ammo, kills, deaths)
- WeaponType enum and Weapon interface
- Bot interface extending PlayerStats with Three.js properties

### Game Configuration (`constants.ts`)
All game balance values in one place:
- Win condition: 20 kills
- Bot count: 6
- Player physics values (speed, gravity, jump force)
- Weapon definitions (pistol infinite, rifle 150 rounds)
- Shield regeneration timings

### Styling Approach
Uses Tailwind CSS loaded via CDN (not build-integrated):
- Extensive backdrop-blur effects for glassmorphism UI
- Gradient backgrounds and borders
- Fixed positioning for overlays and HUD elements

## Development Patterns

### React Patterns
- Functional components only with hooks
- useCallback for stable function references
- useRef for Three.js object access
- Cleanup in useEffect return functions

### Three.js Patterns
- Scene setup in useEffect with proper disposal
- Animation loop with requestAnimationFrame
- Object pooling for projectiles and effects
- Model caching to avoid redundant loading

### Game Logic Structure
Game.tsx follows this flow:
1. Scene initialization (camera, renderer, lighting)
2. Asset loading (models, textures)
3. Game object creation (player, bots, environment)
4. Input handling (pointer lock, keyboard events)
5. Game loop (movement, AI, collision, rendering)

## Configuration Notes

### Unusual Setup Choices
- Dependencies loaded via import maps instead of bundled
- Tailwind via CDN rather than build integration  
- Three.js loaded externally rather than npm package

### Environment Variables
Project expects `VITE_GEMINI_API_KEY` for AI integration (Gemini API).

### Missing Development Tools
- No ESLint/Prettier configuration
- No testing framework setup
- No pre-commit hooks or CI/CD

## API Integration
The codebase mentions Gemini API integration. Ensure Claude Code compatibility when working with AI features.

## Agent Coordination
Multiple AI coding agents work on this project (Claude, Gemini, Cascade). Coordinate changes through proper documentation updates and avoid conflicting modifications.