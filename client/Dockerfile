# ── Stage 1: Build React app ──
FROM node:20-alpine AS builder

WORKDIR /app

# Vite bakes this into the bundle at build time
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY index.html vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json eslint.config.js ./
COPY public ./public
COPY src ./src

RUN npm run build

# ── Stage 2: Serve with Nginx ──
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
