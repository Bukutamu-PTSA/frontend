# Stage 1: Build aplikasi
FROM node:24-alpine AS builder
WORKDIR /app

# Salin package.json dan package-lock.json lalu install dependencies
COPY package*.json ./
RUN npm ci

# Nilai VITE_* ditanam ke bundle saat `npm run build`, jadi harus tersedia di
# tahap build (bukan saat container jalan). Diisi lewat `build.args` di
# docker-compose.yml; yang kosong memakai default di src/config/app.ts.
#
# VITE_API_HOST kosong ("") = backend diakses lewat origin yang sama (/api),
# dipakai saat aplikasi berada di balik reverse proxy HTTPS (Caddy).
ARG VITE_API_HOST=http://192.168.156.206:8000
ARG VITE_APP_NAME
ARG VITE_APP_SHORT_NAME
ARG VITE_ORGANIZATION_NAME
ARG VITE_ORGANIZATION_NAME_SHORT
ARG VITE_ORGANIZATION_UNIT
ARG VITE_ORGANIZATION_UNIT_FULL
ARG VITE_DEVELOPER_NAME
ARG VITE_SYSTEM_OWNER_NAME
ARG VITE_FOOTER_TAGLINE
ARG VITE_BRAND_PRIMARY_COLOR
ARG VITE_BRAND_SECONDARY_COLOR
ARG VITE_BRAND_ACCENT_COLOR
ARG VITE_DEFAULT_TOTAL_LAPORAN
ARG VITE_COPYRIGHT_START_YEAR
ARG VITE_COPYRIGHT_END_YEAR
ARG VITE_ADDRESS_LINE_1
ARG VITE_ADDRESS_LINE_2
ARG VITE_ADDRESS_LINE_3
ARG VITE_CONTACT_EMAIL
ARG VITE_MAPS_URL
ARG VITE_SOCIAL_X_URL
ARG VITE_SOCIAL_FACEBOOK_URL
ARG VITE_SOCIAL_INSTAGRAM_URL
ARG VITE_SESSION_TIMEOUT

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
