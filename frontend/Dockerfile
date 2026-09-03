# Stage 1: Build static assets using Node.js
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package descriptors and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Serve static files with Nginx
FROM nginx:alpine

# Copy built dist files to nginx html folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
