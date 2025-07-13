# AGENTS.md

## Overview
This file documents the coding agents (AI/code assistants) working on the codebase for this browser-based Three.js game. These agents are responsible for assisting with development, code review, maintenance, and automation tasks within the project.

## Coding Agents

### Cascade (AI Coding Assistant)
- **Role:** Cascade is an agentic AI coding assistant designed to help with code generation, review, debugging, and documentation. Cascade operates autonomously and collaboratively with human developers to streamline the software development lifecycle.
- **Capabilities:**
  - Code generation for TypeScript, JavaScript, and Three.js components
  - Automated code review and refactoring
  - Documentation generation and maintenance
  - Error detection and debugging support
  - Task planning and progress tracking
- **Integration:** Cascade interacts with the codebase via a secure interface and follows user-defined rules and project-specific guidelines. It is aware of the project's structure, dependencies, and coding standards.

## Agent Configuration
- **API Keys:**
  - Requires a valid `GEMINI_API_KEY` set in the `.env.local` file for AI-powered features.
- **User Rules:**
  - Agents must not use emojis or non-textual symbols in code or comments.
  - Only explicitly specified AI models are permitted (e.g., gemini-2.5-flash).
  - Agents must update documentation and helper files after any significant codebase change.

## Usage
- Agents are expected to:
  - Adhere to project coding standards
  - Keep documentation up to date
  - Clean up temporary or helper files after use
  - Update `@todo.md`, `@claude.md`, and `@README.md` as needed

## Project Context
- This project is a browser-based game utilizing Three.js, developed with TypeScript and React.
- The agent system is designed to accelerate development, maintain code quality, and ensure best practices are followed.

---

*Last updated: 2025-07-12*
