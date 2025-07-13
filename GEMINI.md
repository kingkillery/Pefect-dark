# Gemini Agent Guidelines

This document provides instructions for the Gemini coding agent.

## Project Overview
- **Project:** Browser-based Three.js game.
- **Tech Stack:** React, TypeScript, Three.js, Vite, Tailwind CSS.
- **Deployment:** Firebase.

## Key Responsibilities
- Assist with code generation, refactoring, and debugging.
- Ensure code quality and adherence to project standards.
- Maintain and update documentation as needed.

## Development Workflow
1.  **Install Dependencies:** `npm install`
2.  **Run Locally:** `npm run dev`
3.  **Build for Production:** `npm run build`

## API Keys
- Ensure your `GEMINI_API_KEY` is correctly set in the `.env.local` file.

## Coding Standards
- **Language:** TypeScript.
- **Styling:** Use Tailwind CSS classes for styling. Follow existing code style and formatting.
- **State Management:** Use React hooks (`useState`, `useCallback`, `useEffect`) for state management.
- **Comments:** Add comments only for complex logic. Do not use emojis.
- **Model:** Use `gemini-2.5-flash` unless otherwise specified.

## File Maintenance
- After making changes, update relevant documentation (`README.md`, `AGENTS.md`).
- Keep this file (`GEMINI.md`) and `CLAUDE.md` updated with any new, relevant instructions.