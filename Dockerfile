# Stage 1: Builder
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./

# Force install correct SWC binary for Alpine
RUN npm install @next/swc-linux-x64-musl --save-dev
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Next.js application
ENV NODE_ENV=qa
RUN npm run build

# Reinstall only production dependencies
RUN npm ci --omit=dev --ignore-scripts

# Stage 2: Production Image
FROM node:18-alpine AS production
WORKDIR /app

# Copy production files from builder
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Inject environment variables at runtime, NOT during build
# You'll provide .env at container runtime via Docker secrets or volume mounts

ENV NODE_ENV=qa
EXPOSE 3000

CMD ["npm", "start"]
