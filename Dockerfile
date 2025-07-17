# Stage 1: Builder
FROM node:18-alpine AS builder
WORKDIR /app

# Copy and install dependencies
COPY package*.json ./

# Install correct SWC binary for Alpine (needed for Next.js)
RUN npm install @next/swc-linux-x64-musl --save-dev

# Install all dependencies cleanly
RUN npm ci

# Copy all source files
COPY . .

# Set env for build
ENV NODE_ENV=qa

# Build the Next.js app
RUN npm run build

# Remove dev dependencies and reinstall production-only
RUN npm ci --omit=dev --ignore-scripts

---

# Stage 2: Production
FROM node:18-alpine AS production
WORKDIR /app

# Copy only required production files
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/next.config.mjs ./next.config.mjs

ENV NODE_ENV=qa
EXPOSE 3000

CMD ["npm", "start"]
