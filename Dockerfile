# Stage 1: Builder
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./

# Force install correct SWC binary for Alpine (musl-based)
RUN npm install @next/swc-linux-x64-musl --save-dev

RUN npm ci

# Copy app source
COPY . .

# Build app for QA
ENV NODE_ENV=qa
RUN npm run build

# Reinstall only prod dependencies (including SWC for Alpine)
RUN npm ci --only=production --ignore-scripts

# Stage 2: Production Image
FROM node:18-alpine AS production
WORKDIR /app

# Copy necessary files
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

ENV NODE_ENV=qa
EXPOSE 3000
CMD ["npm", "start"]
