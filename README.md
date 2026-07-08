# Kasflow v2

**Personal Money Tracker PWA** - Fast, Offline-First, Mobile-First

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646cff.svg)](https://vitejs.dev/)
[![PWA](https://img.shields.io/badge/PWA-Ready-green.svg)](https://web.dev/progressive-web-apps/)

## Overview

Kasflow is a personal finance tracker designed for speed and simplicity. Track transactions, manage multiple wallets, separate money ownership - all in under 5 seconds per transaction.

**Key Features:**
- ⚡ Add transactions in <5 seconds
- 👥 Track shared wallets (separate ownership)
- 🔍 Search transactions instantly
- 📱 Mobile-first PWA (works offline)
- 🎯 Zero complexity - personal use only

## Quick Start

### Prerequisites
- Node.js ≥18.0.0
- npm ≥9.0.0

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
kasflow-v2/
├── src/
│   ├── pages/              # Screen components (Home, History, Add, Settings)
│   ├── shared/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   └── constants/      # App constants
│   ├── services/           # Business logic (balance, transaction, wallet)
│   ├── store/              # Global state (Context API)
│   ├── db/                 # Database layer (Dexie.js)
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── styles/             # Global styles & design tokens
│   └── App.tsx             # Root component with routing
├── public/                 # PWA manifest, icons
├── docs/                   # Project documentation
└── package.json            # Dependencies & scripts
```

## Architecture

**Tech Stack:**
- **Frontend:** React 18 + TypeScript
- **Build:** Vite
- **Storage:** IndexedDB (Dexie.js)
- **State:** Context API + useReducer
- **Styling:** CSS Modules + Design Tokens
- **PWA:** Workbox

**Design Principles:**
1. Speed First - <5 seconds to add transaction
2. Offline First - Works without internet
3. Mobile First - Smartphone optimized
4. One-Hand Friendly - Thumb-reachable controls
5. Information First - Balance is the hero

## Development

### Available Scripts

```bash
# Development server (auto-reload)
npm run dev

# Type check
npm run type-check

# Lint
npm run lint
npm run lint:fix

# Format
npm run format
npm run format:check

# Tests
npm run test
npm run test:ui
npm run test:coverage

# Build
npm run build
npm run preview
```

### Debugging

- **TypeScript errors:** `npm run type-check`
- **Linting issues:** `npm run lint`
- **Format issues:** `npm run format`

## Documentation

- [Product Brief](docs/00-foundation/00_PRODUCT_BRIEF.md) - Vision & principles
- [Domain Model](docs/00-foundation/01_DOMAIN_MODEL.md) - Business entities
- [Decisions](docs/00-foundation/02_DECISIONS.md) - Architecture decisions
- [Design Principles](docs/02-design/00_DESIGN_PRINCIPLES.md) - UI/UX philosophy
- [Bootstrap Plan](BOOTSTRAP_PLAN.md) - Implementation roadmap

## Performance Targets

- Balance calculation: <100ms
- Add transaction: <5 seconds
- View balance: <3 seconds
- Navigation: <200ms

## Browser Support

- iOS Safari 14+
- Chrome/Edge 90+
- Firefox 88+

## License

Personal project - not open source

## Status

✅ Project scaffolding complete  
🚧 Phase 5: Feature implementation (in progress)

---

**For detailed documentation, see the `/docs` directory.**
