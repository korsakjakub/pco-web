# E2E Testing for PCO Poker Game

This directory contains end-to-end tests for the multi-player poker game using Playwright.

## Prerequisites

1. **Backend API must be running**: Make sure the `pco-api` service is running on its default port
2. **Redis must be available**: The API requires Redis for game state management
3. **Dependencies installed**: Run `bun install` in the pco-web directory

## Test Scripts

```bash
# Run all e2e tests
bun run test:e2e

# Run tests with UI (visual test runner)
bun run test:e2e:ui

# Run tests in headed mode (see browser windows)
bun run test:e2e:headed

# Run tests in debug mode (step through)
bun run test:e2e:debug

# Use the focused e2e config
bunx playwright test --config=playwright-e2e.config.ts
```

## Test Scenarios

### Basic Multiplayer Test (`basic-multiplayer.spec.ts`)
- Creates a poker room with 3 players
- Tests player joining flow
- Verifies game startup
- Tests basic poker actions (fold, call, check)

### Advanced Multiplayer Test (`multiplayer-poker.spec.ts`)
- Full poker game simulation with multiple rounds
- Tests all game stages (PRE_FLOP, FLOP, TURN, RIVER)
- Complex betting scenarios and player interactions
- Multiple round progression

## What the Tests Do

1. **Room Creation**: First player creates a new room and becomes admin
2. **Player Joining**: Additional players join using the queue ID
3. **Game Start**: Admin starts the game when enough players are present
4. **Poker Gameplay**: Simulates realistic poker actions and betting rounds
5. **State Verification**: Checks game state, pot size, player chips, etc.

## Test Structure

Each test uses separate browser contexts to simulate different players, ensuring proper isolation and realistic multi-user scenarios.

## Debugging

- Screenshots are automatically taken on failures
- Videos are recorded for failed tests
- Use `--headed` flag to watch tests run in real browsers
- Check `test-results/` directory for artifacts

## Environment Setup

Make sure your development environment is running:

```bash
# Terminal 1: Start the API
cd pco-api
make run

# Terminal 2: Start Redis (if not running)
redis-server

# Terminal 3: Run e2e tests
cd pco-web
bun run test:e2e
```

## Common Issues

1. **Timeouts**: Increase timeout values if your machine is slow
2. **Port conflicts**: Ensure port 8000 is available for the frontend
3. **API not running**: Tests will fail if the backend API is not accessible
4. **Redis connection**: Make sure Redis is running and accessible

## Test Configuration

- `playwright.config.ts`: Main configuration with multiple browsers
- `playwright-e2e.config.ts`: Focused configuration for faster e2e testing
- Tests run sequentially to avoid race conditions in multiplayer scenarios