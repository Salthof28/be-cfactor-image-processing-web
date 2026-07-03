# Stage 1: Base image tanpa corepack/pnpm setup
FROM node:22-alpine AS base
WORKDIR /app

# Stage 2: Install dependencies menggunakan npm ci (Clean, Bebas Error)
FROM base AS dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Stage 3: Build TypeScript NestJS menjadi JavaScript (dist/)
FROM base AS builder
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build
RUN npm prune --production

# Stage 4: Runner produksi
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./

RUN mkdir -p /app/storage/uploads /app/storage/processed

EXPOSE 4000
CMD ["node", "dist/main"]
