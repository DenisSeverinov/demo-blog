# Demo Blog

## Quick Start

1. Copy `.env.example` files to `.env`:
   ```sh
   cp .env.example .env
   cd backend && cp .env.example .env && cd ..
   ```
2. Install dependencies:
   ```sh
   cd backend && pnpm install && cd ../web && pnpm install && cd ..
   ```
3. Start the project using Docker Compose:
   ```sh
   docker-compose up --build
   ```
4. Open your browser and navigate to: [http://localhost:3000](http://localhost:3000)

## Project Structure
- `backend/` — server-side (Nest.js)
- `web/` — client-side (Next.js)