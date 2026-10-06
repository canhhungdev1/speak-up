# ==============================================================================
# Multi-stage Dockerfile for Angular Frontend (apps/web) with Nginx
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build Angular Application
# ------------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency specifications first to leverage Docker layer caching
COPY package*.json ./

RUN npm ci

# Copy source code and build production bundle
COPY . .
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 2: Serve with Nginx Alpine (Production Web Server)
# ------------------------------------------------------------------------------
FROM nginx:alpine AS runner

# Xóa các file mặc định của Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copy sản phẩm build tĩnh từ builder stage
COPY --from=builder /app/dist/web/browser /usr/share/nginx/html

# Copy file cấu hình Nginx (SPA fallback + Reverse Proxy API)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
