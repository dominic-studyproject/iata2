# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint checks

## Architecture

This is a Next.js application using the Pages Router architecture with TypeScript and Tailwind CSS.

### Key Structure
- `pages/` - Next.js pages (file-based routing)
  - `pages/index.tsx` - Home page
  - `pages/api/` - API routes
- `styles/` - Global CSS styles
- `public/` - Static assets

### Technology Stack
- Next.js 15.3.4 with Pages Router
- React 19
- TypeScript with strict mode
- Tailwind CSS v4
- ESLint with Next.js configuration
- Geist fonts (optimized with next/font)

### Path Aliases
- `@/*` maps to root directory (`./`)