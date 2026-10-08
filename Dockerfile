# Stage 1: Build aplikasi
FROM node:24-alpine AS builder
WORKDIR /app

# Salin package.json dan package-lock.json lalu install dependencies
COPY package*.json ./
RUN npm ci

# Salin semua source code dan lakukan build
COPY . .
RUN npm run build

# Stage 2: Jalankan Nitro server (SSR)
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Salin hasil build. Output Nitro sudah self-contained (deps ter-bundle),
# jadi tidak perlu install ulang node_modules di stage ini.
COPY --from=builder /app/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
