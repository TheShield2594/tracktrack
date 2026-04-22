# ── Stage 1: install & compile dependencies ───────────────────────────────────
FROM node:22-alpine AS deps

# better-sqlite3 is a native addon — needs build toolchain
RUN apk add --no-cache libc6-compat python3 make g++

WORKDIR /app
COPY package*.json ./
RUN npm ci

# ── Stage 2: build Next.js ────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ── Stage 3: lean production image ────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Static assets
COPY --from=builder /app/public ./public

# Built app
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

# Production node_modules (compiled native binaries included from deps stage)
COPY --from=deps    /app/node_modules ./node_modules
COPY --chown=nextjs:nodejs package.json ./

# Persistent data directory for the SQLite database
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data

USER nextjs

EXPOSE 3000

CMD ["node_modules/.bin/next", "start"]
