# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Run
FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs
COPY package*.json ./
RUN npm ci --production && npm cache clean --force
COPY --from=builder /app/dist ./dist
USER nestjs
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "dist/main"]
