# Stage 1: Builder
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY .env .env  # <-- Add this line
RUN npm install @next/swc-linux-x64-musl --save-dev
RUN npm ci
COPY . .

ENV NODE_ENV=qa
RUN npm run build
RUN npm ci --omit=dev --ignore-scripts

# Stage 2: Production
FROM node:18-alpine AS production
WORKDIR /app

COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/next.config.mjs ./next.config.mjs

ENV NODE_ENV=qa
EXPOSE 3000
CMD ["npm", "start"]
