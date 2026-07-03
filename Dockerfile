FROM node:22-alpine AS base
WORKDIR /app

FROM base AS dependencies
COPY package.json package-lock.json ./
RUN npm install

FROM base AS builder
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build
RUN npm prune --production

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./

RUN mkdir -p /app/storage/uploads /app/storage/processed

EXPOSE 4000
CMD ["node", "dist/main"]
