# ==============================================================================
# Multi-stage Dockerfile for NestJS API (apps/api)
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Builder
# ------------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency specifications first to leverage Docker layer caching
COPY package*.json ./

RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# Remove development dependencies to keep only production modules
RUN npm prune --omit=dev

# ------------------------------------------------------------------------------
# Stage 2: Production Runner
# ------------------------------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Chạy ứng dụng dưới quyền non-root user để tăng tính bảo mật
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Chỉ copy những tài nguyên cần thiết từ builder stage
COPY --from=builder --chown=appuser:appgroup /app/package*.json ./
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist

USER appuser

EXPOSE 3000

CMD ["node", "dist/main"]
