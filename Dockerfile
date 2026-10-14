# Stage 1: Build the TanStack Start application
FROM node:22-alpine AS build

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the production Nitro server
RUN npm run build

# Stage 2: Run the TanStack Start server
FROM node:22-alpine AS runtime

WORKDIR /app

# Copy the generated Nitro output
COPY --from=build /app/.output ./.output

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
