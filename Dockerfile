# --------------------------------------
# Stage 1: Builder
# --------------------------------------
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./

# Force install correct SWC binary for Alpine (musl-based)
RUN npm install @next/swc-linux-x64-musl --save-dev
RUN npm ci

# Copy app source
COPY . .

# Set environment for build
ENV NODE_ENV=qa

# Build application
RUN npm run build

# Install production-only dependencies
RUN npm ci --omit=dev --ignore-scripts

# --------------------------------------
# Stage 2: Production Image
# --------------------------------------
FROM node:18-alpine AS production
WORKDIR /app

# Copy necessary files from builder stage
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Set production environment
ENV NODE_ENV=qa

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
